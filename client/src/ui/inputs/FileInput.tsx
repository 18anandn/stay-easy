import {
  ChangeEventHandler,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { RiDeleteBin5Line } from 'react-icons/ri';

import Button from '../Button';
import toast from 'react-hot-toast';

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
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  innerRef: React.MutableRefObject<HTMLInputElement> | undefined;
  fileChangeHandler: ((files: File[]) => void) | undefined;
};

type ChildrenProps = {
  children: ReactNode;
  fileChangeHandler: ((files: File[]) => void) | undefined;
};

const FileInputContext = createContext<FileInputContextProps>({
  files: [],
  setFiles: () => {},
  innerRef: undefined,
  fileChangeHandler: undefined,
});

const FileInput = ({ children, fileChangeHandler }: ChildrenProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const innerRef = useRef<HTMLInputElement>(document.createElement('input'));
  return (
    <FileInputContext.Provider
      value={{ files, setFiles, innerRef, fileChangeHandler }}
    >
      {children}
    </FileInputContext.Provider>
  );
};

type Props = {
  maxFiles: number;
} & Omit<React.ComponentPropsWithRef<'input'>, 'type' | 'onChange'>;

const JPEG_NUMBER = 'ffd8ff';
const PNG_NUMBER = '89504e47';
const WEBP_NUMBER = ['52494646', '57454250'];

const Input: React.FC<Props> = forwardRef(({ maxFiles, ...props }, ref) => {
  const { files, setFiles, innerRef, fileChangeHandler } =
    useContext(FileInputContext);
  const dummyRef = useRef<HTMLInputElement>(document.createElement('input'));

  useImperativeHandle<HTMLInputElement, HTMLInputElement>(
    ref,
    () => {
      if (innerRef) {
        return innerRef.current;
      }
      return document.createElement('input');
    },
    [innerRef],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = async () => {
    const selectedFiles = dummyRef.current.files;
    if (selectedFiles) {
      if (files.length + selectedFiles.length > maxFiles) {
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
        const data = await new Response(file.slice(0, 12)).arrayBuffer();
        const bytes = [...new Uint8Array(data)]
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('');
        let newName = `${Date.now()}${i}`;
        if (
          !(
            bytes.startsWith(JPEG_NUMBER) ||
            bytes.startsWith(PNG_NUMBER) ||
            (bytes.startsWith(WEBP_NUMBER[0]) && bytes.endsWith(WEBP_NUMBER[1]))
          )
        ) {
          toast.error(`Invalid image${selectedFiles.length > 1 ? 's' : ''}`, {
            id: 'file type allowed',
          });
          dummyRef.current.value = '';
          return;
        }
        const newFile = new File([file], newName, {
          type: file.type,
        });
        fileList.push(newFile);
      }
      setFiles((prev) => {
        const newFiles = [...fileList, ...prev];
        const dT = new DataTransfer();
        newFiles.forEach((file) => dT.items.add(file));
        if (innerRef) {
          innerRef.current.files = dT.files;
        }
        fileChangeHandler?.(newFiles);
        return newFiles;
      });
    }
    dummyRef.current.value = '';
  };

  return (
    <StyledFileInput>
      <Button
        type="button"
        disabled={files.length === maxFiles}
        onClick={() => {
          dummyRef.current.click();
        }}
      >
        Select images
      </Button>
      <input ref={innerRef} type="file" {...props} accept="image/*" />
      <input
        ref={dummyRef}
        type="file"
        {...props}
        onChange={handleChange}
        accept="image/*"
      />
    </StyledFileInput>
  );
});

const Display: React.FC = () => {
  const { files, setFiles, innerRef, fileChangeHandler } =
    useContext(FileInputContext);
  if (files.length !== 0) {
    return (
      <DisplayBox>
        {files.map((file) => {
          const imageURL = URL.createObjectURL(file);
          return (
            <div className="file-row" key={file.name}>
              <img src={imageURL} alt="" />
              <Button
                type="button"
                $type="danger"
                onClick={() => {
                  setFiles((prev) => {
                    const newFiles = prev.filter(
                      (val) => val.name !== file.name,
                    );
                    const dT = new DataTransfer();
                    newFiles.forEach((file) => dT.items.add(file));
                    if (innerRef) {
                      innerRef.current.files = dT.files;
                    }
                    fileChangeHandler?.(newFiles);
                    return newFiles;
                  });
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
