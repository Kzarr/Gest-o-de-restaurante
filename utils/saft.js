// utils/saft.js
const { create } = require('xmlbuilder2');

const generateSAFT = (bills) => {
  const root = create({ version: '1.0' })
    .ele('AuditFile')
    .ele('Header')
      .ele('AuditFileVersion').txt('1.04_01').up()
      .ele('CompanyID').txt('999999990').up() // Substitua pelo NIF do seu restaurante
    .up()
    .ele('SalesInvoices');
  
  bills.forEach(bill => {
    root.ele('Invoice')
      .ele('InvoiceNo').txt(bill.invoiceNumber || 'FT-001').up()
      .ele('InvoiceDate').txt(bill.date?.toISOString() || new Date().toISOString()).up()
      .ele('CustomerTaxID').txt(bill.customerNIF || '999999999').up()
      .ele('InvoiceTotal').txt(bill.totalAmount?.toFixed(2) || '0.00').up();
  });

  return root.end({ prettyPrint: true });
};

module.exports = { generateSAFT };