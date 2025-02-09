import { useState, useEffect } from 'react';
// import { toolInference } from "../../../api/fetchOpenAI";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry"; // Ensure the worker is loaded
import { parseUserText } from "../../../api/fetchOpenAI";
import { parse } from 'path';

const extractTextFromPdf = async (file: File): Promise<string> => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const pdf = await pdfjsLib.getDocument({ data: reader.result || ""}).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
        }

        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};


const Upload = () => {
    const [insuranceFiles, setInsuranceFiles] = useState<File[]>([]);
    const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
    const [isUploaded, setIsUploaded] = useState(false);

    const handleInsuranceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files).slice(0, 3); // Allow up to 3 files
            setInsuranceFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3)); // Ensure max of 3 files
        }
    };

    const handlePrescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setPrescriptionFile(event.target.files[0]); // Save the first selected file
        }
    };

    const handleUpload = async () => {
        // Handle file parsing
        var allInsuranceFiles = "";
        insuranceFiles.forEach(async (file) => {
            allInsuranceFiles += extractTextFromPdf(file);
        });
        const LLMextracted = await parseUserText(allInsuranceFiles);


        const insuranceTexts = await Promise.all(insuranceFiles.map(file => extractTextFromPdf(file)));
        console.log('Extracted text from insurance files:', insuranceTexts.join('\n'));

        if (prescriptionFile) {
            const prescriptionText = await extractTextFromPdf(prescriptionFile);
            console.log('Extracted text from prescription file:', prescriptionText);
        }

        if (prescriptionFile) {
            const text = await extractTextFromPdf(prescriptionFile);
            console.log('Extracted text from prescription file:', text);
        }

        setIsUploaded(true);
        console.log(insuranceFiles); 
        console.log(prescriptionFile);
    }

    return (
        <div id="upload-view-container">
            <p>Upload documents</p>
            <div className="input-container">
                <label>Insurance card</label>
                <input type="file" accept = "image/png, image/jpeg, .pdf .doc .docx" onChange={handleInsuranceChange} />
            </div>

            <div className="input-container">
                <label>Prescriptions (medical, vision, supplements) </label>
                <input type="file" accept = "image/png, image/jpeg, .pdf .doc .docx" onChange={handlePrescriptionChange} />
            </div>
            <button onClick={handleUpload}>
                {isUploaded ? "Uploaded" : "Upload"}
            </button>
        </div>
    )
}

export default Upload;