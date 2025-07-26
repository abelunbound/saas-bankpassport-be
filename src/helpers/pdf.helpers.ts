import * as html_to_pdf from 'html-pdf-node';
import puppeteer from "puppeteer";
import chromium from "chrome-aws-lambda";

export const generatePdfFromHtml = async (htmlString: string) => {
    const browser = await puppeteer.launch({
        executablePath: undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setContent(htmlString, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
};


export const generatePdf = async (content: string): Promise<Buffer> => {
    let options = { format: 'A4', printBackground: true };
    let file = { content };
    return await html_to_pdf.generatePdf(file, options)
}