import imageCompression from "browser-image-compression";

export async function upload(file) {
  const optimizedFile = await compress(file);
  const data = new FormData();
  data.append("file", optimizedFile);
  data.append("upload_preset", "drezzup-store");
  data.append("cloud_name", "dp563neb6");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dp563neb6/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );
  const result = await res.json();
  console.log(result);
  return result;
}

async function compress(file) {
  const options = {
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  const result = await imageCompression(file, options);
  return result;
}
