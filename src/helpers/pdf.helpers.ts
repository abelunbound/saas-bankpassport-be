import * as html_to_pdf from 'html-pdf-node';

export const generatePdf = async (content: string):Promise<Buffer> => {
    let options = { format: 'A4', printBackground: true };
    let file = { content };
    return await html_to_pdf.generatePdf(file, options)
}