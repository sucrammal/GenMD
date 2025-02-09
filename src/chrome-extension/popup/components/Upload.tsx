import { useState, useEffect } from 'react';

const Upload = () => {
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
    const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

    const handleInsuranceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setInsuranceFile(event.target.files[0]); // Save the first selected file
      }
    };

    const handlePrescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setPrescriptionFile(event.target.files[0]); // Save the first selected file
        }
    };

    useEffect(() => { // placeholder useEffect to avoid TypeScript errors
        console.log(insuranceFile); 
        console.log(prescriptionFile);
    }, []); 

    return (
        <div id="upload-view-container">
            <p>Upload documents</p>
            <div className="input-container">
                <label>Insurance card</label>
                <input type="file" onChange={handleInsuranceChange} />
            </div>

            <div className="input-container">
                <label>Prescriptions (medical, vision, supplements) </label>
                <input type="file" onChange={handlePrescriptionChange} />
            </div>
        </div>
    )
}

export default Upload;