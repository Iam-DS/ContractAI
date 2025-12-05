import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generatePDF() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // HTML-Datei laden
    const htmlPath = join(__dirname, 'mustervertrag-it-dienstleistung.html');
    const htmlContent = readFileSync(htmlPath, 'utf-8');
    
    await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
    });
    
    // PDF generieren
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '1cm',
            right: '1cm',
            bottom: '1cm',
            left: '1cm'
        }
    });
    
    // PDF speichern
    const pdfPath = join(__dirname, 'mustervertrag-it-dienstleistung.pdf');
    writeFileSync(pdfPath, pdfBuffer);
    
    console.log(`PDF erstellt: ${pdfPath}`);
    console.log(`Größe: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    
    await browser.close();
}

generatePDF().catch(console.error);


