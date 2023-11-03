/* eslint-disable no-restricted-globals */
// import { EImageType, compressAccurately } from 'image-conversion';
const MAX_IMAGE_SIZE_KB = 200;
// const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_KB * 1024;



// const compressImages = async (images: Blob[]): Promise<Blob[]> => {
//   const arr: Promise<Blob>[] = [];
//   for (let image of images) {
//     // console.log(image.size);
//     arr.push(
//       compressAccurately(image, {
//         accuracy: 1,
//         type: EImageType.JPEG,
//         size: Math.min(image.size / 1024, MAX_IMAGE_SIZE_KB),
//       }),
//     );
//   }
//   return Promise.all(arr);
// };



self.addEventListener('message', async (event: MessageEvent<string[]>) => {
  const blobs: Promise<Blob>[] = [];
  // const urls = event.data.map((url) => {
  //   const arr = url.split(':');
  //   arr.shift();
  //   return arr.join(':');
  // });
  // console.log(urls);
  for (let url of event.data) {
    blobs.push(
      new Promise<Blob>(async (resolve) => {
        const res = await fetch(url);
        // console.log(res)
        const blob = await res.blob();
        console.log(url);
        console.log(blob);
        resolve(blob);
      }),
    );
  }
  const images = await Promise.all(blobs);
  // console.log('here hjere')
  // console.log(images);
  const resBlobs = await compressImages(images);
  self.postMessage(resBlobs.map((blob) => URL.createObjectURL(blob)));
});
