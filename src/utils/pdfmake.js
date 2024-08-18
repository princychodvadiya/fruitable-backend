const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

const fonts = {
    Roboto: {
        normal: path.join(__dirname, '../../public/font/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../../public/font/Roboto-Medium.ttf'),
        italics: path.join(__dirname, '../../public/font/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '../../public/font/Roboto-MediumItalic.ttf')
    }
};

const printer = new PdfPrinter(fonts);

const exportpdfmake = () => {
    console.log(__dirname);

    const imagePath = path.join(__dirname, '../../../../../fullstackProject/backend/ecommerece/public/temp/1718632747046-898823660-Plums.jpg');

    const docDefinition = {
        content: [
            {
                image: imagePath,
                width: 100,
            },
            { text: 'Invoice', style: 'subheader', alignment: 'center', margin: [0, 0, 0, 20], fontSize: 30 },
            { text: 'Name:Princy Chodvadiya', margin: [0, 0, 0, 10] },
            { text: 'Address:surat', margin: [0, 0, 0, 10] },
            { text: 'Email:princy@gmail.com', margin: [0, 0, 0, 10] },
            { text: 'Phone Number:2563568975', margin: [0, 0, 0, 20] },

            {
                style: 'tableExample',
                table: {
                    body: [
                        [{ text: 'Sr No', bold: true }, { text: 'Item', bold: true }, { text: 'Quantity', bold: true }, { text: 'Price', bold: true }, { text: 'Total Price', bold: true },],
                        ['1', 'samsung s23', '1', '50000', '50000'],
                        ['2', 'cover', '2', '1000', '2000'],
                        [{ text: 'Total Amount', colSpan: 4, bold: true }, '', '', '', '52000'],
                    ]
                }
            },
        ]
    };

    const outputPath = path.join(__dirname, "../../../../../fullstackProject/backend/ecommerece/document.pdf");

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(outputPath));
    pdfDoc.end();
}

module.exports = exportpdfmake;
