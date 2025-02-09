import { useState } from 'react';
import Tesseract from "tesseract.js";
import { parseUserText } from "../../../api/fetchOpenAI";

// image file to text
export const extractTextFromImage = async (file: File): Promise<string> => {
  console.log('Starting image extraction for file:', file.name);
  try {
    const { data: { text } } = await Tesseract.recognize(file, "eng", {
      logger: (m) => console.log('Tesseract progress:', m), 
    });
    console.log('Image extraction completed');
    return text;
  } catch (error) {
    console.error('Error in image extraction:', error);
    return "";
  }
};

const Upload = () => {
  const [insuranceFiles, setInsuranceFiles] = useState<File[]>([]);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleInsuranceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).slice(0, 3);
      console.log('Insurance files selected:', newFiles.map(f => f.name));
      setInsuranceFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 3));
    }
  };

  const handlePrescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log('Prescription file selected:', event.target.files[0].name);
      setPrescriptionFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    console.log('Starting upload process');
    console.log('Number of insurance files:', insuranceFiles.length);
    console.log('Has prescription file:', !!prescriptionFile);

    let allInsuranceFiles = "";
    
    // Process insurance files sequentially
    for (const file of insuranceFiles) {
      if (file) {
        try {
          console.log('Processing file:', file.name, 'Type:', file.type);
          if (file.type === "image/png" || file.type === "image/jpeg") {
            const imageText = await extractTextFromImage(file);
            console.log('Image text extracted, length:', imageText.length);
            allInsuranceFiles += imageText;
          } else {
            console.log('Skipping non-image file:', file.type);
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
        }
      }
    }
    
    console.log('Calling LLM for insurance text, length:', allInsuranceFiles.length);
    try {
      const insuranceLLMextracted = await parseUserText(
        allInsuranceFiles, 
        "Insurance Provider, Insurance ID, Network, Deductible, Coverage Details"
      );
      console.log('Insurance LLM response:', insuranceLLMextracted.message);
    } catch (error) {
      console.error('Error in insurance LLM processing:', error);
    }

    let prescriptionText = "";
    if (prescriptionFile && (prescriptionFile.type === "image/png" || prescriptionFile.type === "image/jpeg")) {
      try {
        console.log('Processing prescription image');
        prescriptionText = await extractTextFromImage(prescriptionFile);
        console.log('Prescription text extracted, length:', prescriptionText.length);
      } catch (error) {
        console.error('Error processing prescription file:', error);
      }
    }
    
    if (prescriptionText) {
      console.log('Calling LLM for prescription text');
      try {
        const prescriptionLLMextracted = await parseUserText(
          prescriptionText, 
          "Medications, Medication Info"
        );
        console.log('Prescription LLM response:', prescriptionLLMextracted.message);
      } catch (error) {
        console.error('Error in prescription LLM processing:', error);
      }
    }

    setIsUploaded(true);
    console.log('Upload process completed');
  };

  return (
    <div id="upload-view-container">
      <p>Upload documents</p>
      <div className="input-container">
        <label>Insurance card</label>
        <input 
          type="file" 
          accept="image/png, image/jpeg" 
          onChange={handleInsuranceChange} 
          multiple
        />
      </div>

      <div className="input-container">
        <label>Prescriptions (medical, vision, supplements) </label>
        <input 
          type="file" 
          accept="image/png, image/jpeg" 
          onChange={handlePrescriptionChange} 
        />
      </div>
      <button onClick={handleUpload}>
        {isUploaded ? "Uploaded" : "Upload"}
      </button>
    </div>
  );
};

export default Upload;