import React, { useCallback, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { Box, Button, LinearProgress, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { languageData } from '@/constants';

interface CustomerIProps {
  files: File[];
  sizeKB: string[];
  sizeMB: string[];
  text: string;
  bClr: boolean;
  fClr: boolean;
  setFClr: React.Dispatch<React.SetStateAction<boolean>>;
  setBClr: React.Dispatch<React.SetStateAction<boolean>>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  // setSizeMB: React.Dispatch<React.SetStateAction<File[]>>;
  // setSizeKB: React.Dispatch<React.SetStateAction<File[]>>;
  setSizeKB: React.Dispatch<React.SetStateAction<string[]>>;
  setSizeMB: React.Dispatch<React.SetStateAction<string[]>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
}
const Four = ({
  files,
  setFiles,
  sizeKB,
  setSizeKB,
  sizeMB,
  setSizeMB,
  text,
  setText,
  bClr,
  fClr,
  setFClr,
  setBClr,
}: CustomerIProps) => {
  // const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  // const [sizeKB, setSizeKB] = useState<string[]>([]);
  // const [sizeMB, setSizeMB] = useState<string[]>([]);
  // const [text, setText] = useState<string>('');

  const theme = useTheme();

  const customTextField = {
    '& .MuiTextField-root': {
      // border: '1px solid blue',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      // borderColor: text ? theme.palette.grey['700'] : 'red',
      borderColor: bClr === false ? 'red' : theme.palette.grey['700'],
      // '& .MuiInputLabel-root': { color: 'blue' },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.grey['400'],
    },
  };

  const handleChange = (event: any): void => {
    if (event.target.value.length <= 300) {
      setText(event.target.value);
      setBClr(true);
    }
  };

  // useEffect(() => {
  //   if (files.length > 0) {
  //     uploadFiles(files);
  //   }
  // }, [files]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles);
      const filteredFiles: any = newFiles.filter((file) => {
        // Check file type
        const fileType = file.type;
        if (
          fileType === 'image/png' ||
          fileType === 'image/jpeg' ||
          fileType === 'image/svg+xml' ||
          fileType === 'image/gif'
        ) {
          // Check file size
          const fileSize = file.size;
          const maxSize = 30 * 1024 * 1024; // 30MB in bytes
          if (fileSize <= maxSize) {
            setFClr(true);

            return true;
          } else {
            // console.log(`File ${file.name} exceeds the maximum size limit (30MB).`);
            alert('File exceeds the maximum size limit');
            return false;
          }
        } else {
          // console.log(`File ${file.name} has an unsupported file type.`);
          alert(`File ${file.name} has an unsupported file type.`);
          return false;
        }
      });
      // setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);

      // setFiles((prevFiles: any) => any => ({ ...prevFiles, ...filteredFiles }));
      setFiles((prevFiles: File[]) => [...prevFiles, ...filteredFiles]);

      setProgress((prevProgress) => [...prevProgress, ...filteredFiles.map(() => 0)]);
    }
  };

  const uploadFiles = useCallback(
    (uploadFiles: File[]) => {
      uploadFiles.forEach((file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        //---------size----
        // Get the size of the file in bytes
        const fileSizeInBytes = file.size;

        // Convert bytes to kilobytes (KB)
        const fileSizeInKB = fileSizeInBytes / 1024;

        // Convert bytes to megabytes (MB)
        const fileSizeInMB = fileSizeInKB / 1024;

        // Save the size of the file in KB and MB to a new state
        // setSizeKB((prevSizeKB) => {
        //   const newSizeKB = [...prevSizeKB];
        //   newSizeKB[index] = fileSizeInKB.toFixed(2); // Size in KB with 2 decimal places
        //   return newSizeKB;
        // });
        setSizeKB((prevSizeKB) => {
          const newSizeKB = [...prevSizeKB];
          newSizeKB[index] = fileSizeInKB.toFixed(2); // Assuming fileSizeInKB is a number
          return newSizeKB;
        });
        setSizeMB((prevSizeMB) => {
          const newSizeMB = [...prevSizeMB];
          newSizeMB[index] = fileSizeInMB.toFixed(2); // Size in MB with 2 decimal places
          return newSizeMB;
        });

        //---------size----

        // Simulating file upload progress
        const interval = setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[index] += 5; // Simulating progress increment
            return newProgress;
          });
        }, 1000); // Adjusted interval for 2 seconds

        // Simulating file upload completion
        setTimeout(() => {
          clearInterval(interval);
          setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[index] = 100; // Set progress to 100 when upload completes
            return newProgress;
          });
        }, 2000); // 2 seconds timeout
      });
    },
    [setSizeKB, setSizeMB],
  );

  useEffect(() => {
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, [files, uploadFiles]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setProgress((prevProgress) => [...prevProgress, ...newFiles.map(() => 0)]);
    }
  };

  const handleButtonClick = () => {
    document.getElementById('file-input')?.click();
  };

  //delete my list
  const handleDelete = (index: any) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const { labels } = languageData.form.miscData;

  return (
    <Box
      sx={{
        mt: '65px',
      }}
    >
      <input
        id="file-input"
        type="file"
        onChange={handleFileUpload}
        multiple
        style={{ display: 'none' }}
      />
      <Box
        sx={{
          width: '100%',
          minHeight: '100px',
          border: '2px dashed',
          borderColor: fClr === false ? 'red' : '#505050',
          borderRadius: '5px',
          padding: '20px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Box>
          <Button
            variant="text"
            onClick={handleButtonClick}
            sx={{ textTransform: 'none' }}
          >
            <DriveFileMoveIcon
              sx={{
                transform: 'rotate(270deg)',
              }}
            />
          </Button>
        </Box>
        <Box>
          <Button
            variant="text"
            onClick={handleButtonClick}
            sx={{ textTransform: 'none' }}
          >
            Klicken Sie zum Hochladen
          </Button>
          oder Drag & Drop
        </Box>
        <Box>SVG, PNG, JPG or GIF (max. 30mb)</Box>
      </Box>
      <Box>
        {files.map((file, index) => (
          <Box
            key={index}
            sx={{
              listStyleType: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              my: 3,
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box>
                <DriveFileMoveIcon sx={{ transform: 'rotate(270deg)' }} />
              </Box>
              <Box>
                <Box>{file.name}</Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  {sizeKB[index] ? (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <span>{`${sizeKB[index]} KB`}</span> -
                      {progress[index] === 100 && ' Complete '}
                      {progress[index] < 100 &&
                        progress[index] > 0 &&
                        'Upload in progress'}
                      {progress[index] === 0 && 'Upload'}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      sizeMB[index] && <span>{`${sizeMB[index]} MB`}</span> -
                      {progress[index] === 100 && ' Complete '}
                      {progress[index] < 100 &&
                        progress[index] > 0 &&
                        'Upload in progress'}
                      {progress[index] === 0 && 'Upload'}
                    </Box>
                  )}

                  <LinearProgress
                    variant="determinate"
                    value={progress[index]}
                    sx={{
                      my: 1,
                      width: '200px',
                      '& MuiLinearProgress-bar1': {
                        backgroundColor: '#666666',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box>
              <Button onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 6 }}>
        <TextField
          fullWidth
          label={labels.note}
          multiline
          minRows={4}
          value={text}
          onChange={handleChange}
          variant="outlined"
          sx={{
            ...customTextField,
          }}
        />
        <p style={{ paddingLeft: '15px' }}>0 / {300 - text.length}</p>
      </Box>
    </Box>
  );
};

export default Four;
