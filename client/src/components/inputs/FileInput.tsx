import {
  ChangeEventHandler,
  ReactNode,
  createContext,
  useContext,
  useRef,
} from 'react';
import styled from 'styled-components';
import { RiDeleteBin5Line } from 'react-icons/ri';

import Button from '../buttons/Button';
import toast from 'react-hot-toast';
import { MAX_IMAGE_SIZE, MAX_IMAGE_SIZE_KB } from '../../data/constants';

const StyledFileInput = styled.div`
  input {
    display: none;
  }
`;

const DisplayBox = styled.div`
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .file-row {
    display: flex;
    gap: 1rem;

    & > * {
      margin: auto 0 auto 0;
    }
  }

  img {
    --img-size: 3.5rem;
    height: var(--img-size);
    width: var(--img-size);
    object-fit: contain;
    border: 1px solid black;
  }
`;

type FileInputContextProps = {
  value: File[];
  onChange: ((value: File[]) => void) | undefined;
};

type ChildrenProps = {
  children: ReactNode;
  value: File[];
  onChange: ((value: File[]) => void) | undefined;
};

const FileInputContext = createContext<FileInputContextProps>({
  value: [],
  onChange: undefined,
});

const FileInput = ({ children, value, onChange }: ChildrenProps) => {
  return (
    <FileInputContext.Provider value={{ value, onChange }}>
      {children}
    </FileInputContext.Provider>
  );
};

type Props = {
  maxFiles: number;
  name: string;
};

const JPEG_NUMBER = 'ffd8ff';
const PNG_NUMBER = '89504e47';
const WEBP_NUMBER = ['52494646', '57454250'];

const Input: React.FC<Props> = ({ maxFiles, name }) => {
  const { value, onChange } = useContext(FileInputContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = async () => {
    const inputElem = inputRef.current;
    if (inputElem) {
      const selectedFiles = inputElem.files;
      if (selectedFiles) {
        if (value.length + selectedFiles.length > maxFiles) {
          toast.error(
            maxFiles === 1
              ? 'You can select only one image'
              : `Max ${maxFiles} images allowed in this field`,
            {
              id: 'max files allowed',
            },
          );
          return;
        }
        const fileList: File[] = [];
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          console.log(file.size);
          if (file.size > MAX_IMAGE_SIZE) {
            toast.error(`Max file size allowed is ${MAX_IMAGE_SIZE_KB} KB`, {
              id: 'file type allowed',
            });
            inputElem.value = '';
            return;
          }
        }
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const data = await new Response(file.slice(0, 12)).arrayBuffer();
          const bytes = [...new Uint8Array(data)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('');
          let newName = `${Date.now()}${i}`;
          if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            if (!bytes.startsWith(JPEG_NUMBER)) {
              toast.error(
                `Invalid image${selectedFiles.length > 1 ? 's' : ''}`,
                {
                  id: 'file type allowed',
                },
              );
              inputElem.value = '';
              return;
            }
            newName += '.jpg';
          } else if (file.type === 'image/png') {
            if (!bytes.startsWith(PNG_NUMBER)) {
              toast.error(
                `Invalid image${selectedFiles.length > 1 ? 's' : ''}`,
                {
                  id: 'file type allowed',
                },
              );
              inputElem.value = '';
              return;
            }
            newName += '.png';
          } else if (file.type === 'image/webp') {
            if (
              !(
                bytes.startsWith(WEBP_NUMBER[0]) &&
                bytes.endsWith(WEBP_NUMBER[1])
              )
            ) {
              toast.error(
                `Invalid image${selectedFiles.length > 1 ? 's' : ''}`,
                {
                  id: 'file type allowed',
                },
              );
              inputElem.value = '';
              return;
            }
            newName += '.webp';
          } else {
            toast.error('Only jpeg, png and webp type images are allowed', {
              id: 'file type allowed',
            });
            inputElem.value = '';
            return;
          }
          const newFile = new File([file], newName, {
            type: file.type,
          });
          fileList.push(newFile);
        }
        const newFiles = [...fileList, ...value];
        const dT = new DataTransfer();
        newFiles.forEach((file) => dT.items.add(file));
        onChange?.(newFiles);
      }
      inputElem.value = '';
    }
  };

  return (
    <StyledFileInput>
      <Button
        type="button"
        disabled={value.length === maxFiles}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        Select images
      </Button>
      <input
        ref={inputRef}
        name={name}
        id={name}
        multiple={maxFiles > 1}
        type="file"
        onChange={handleChange}
        accept="image/*"
      />
    </StyledFileInput>
  );
};

const Display: React.FC = () => {
  const { value, onChange } = useContext(FileInputContext);
  if (value.length !== 0) {
    return (
      <DisplayBox>
        {value.map((file) => {
          const imageURL = URL.createObjectURL(file);
          return (
            <div className="file-row" key={file.name}>
              <img src={imageURL} alt="" />
              <Button
                type="button"
                $type="danger"
                onClick={() => {
                  const newFiles = value.filter((val) => val !== file);
                  const dT = new DataTransfer();
                  newFiles.forEach((file) => dT.items.add(file));
                  onChange?.(newFiles);
                }}
              >
                <RiDeleteBin5Line />
              </Button>
            </div>
          );
        })}
      </DisplayBox>
    );
  }
  return null;
};

FileInput.Input = Input;
FileInput.Display = Display;

export default FileInput;
