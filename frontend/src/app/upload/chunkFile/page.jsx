"use client"
import React, {useState}  from 'react'
import axios from 'axios';

const ChunkFile = () => {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      handleFileUpload(selectedFile);
  };

  const handleFileUpload = async (file) => {
      try {

       const chunkSize = 100*1024*1024; // 100mb chunks
       const totalchunks = Math.ceil(file.size/chunkSize);
       console.log(file.size);
       console.log(chunkSize);
       console.log(totalchunks);

       let start = 0, promises = [];
       for(let chunkIndex = 0; chunkIndex < totalchunks; chunkIndex++) {
         const chunk = file.slice(start, start + chunkSize);
         start += chunkSize;

         const formData = new FormData();
         formData.append('filename', `${chunkIndex+1}. ${file.name}`);
         formData.append('chunk', chunk);
         formData.append('totalChunks', totalchunks);
         formData.append('chunkIndex', chunkIndex);

         console.log('Uploading chunk', chunkIndex + 1, 'of', totalchunks);

         promises.push(axios.post('http://localhost:8000/upload', formData, {
           headers: {
             'Content-Type': 'multipart/form-data'
           } }));
       }
       await Promise.all(promises);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };


return (
  <div className='m-10'>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
 <input type="file" name="file" onChange={handleFileChange} />
 <button
   type="submit"
   className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
 >
   Upload
 </button>
</form>
  </div>
)
}

export default ChunkFile