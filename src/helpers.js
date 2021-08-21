import JSZip from "jszip";

// Helpers for ZipJS
export const getType = (ext) => {
  let extType = "";
  switch (ext) {
    case "jpg":
    case "JPG":
    case "png":
    case "PNG":
      extType = "image";
      break;
    case "txt":
    case "TXT":
      extType = "text";
      break;
    case "json":
    case "JSON":
      extType = "json";
      break;
    default:
      extType = "raw";
      break;
  }
  return extType;
};

export function decodeBase64(data) {
    if (typeof Buffer === "function") {
        return Buffer.from(data, "base64").toString("utf-8");
    } else {
        throw new Error("Failed to determine the platform specific decoder");
    }
}

// export async function getZipFilesContent(data) {
//   const zipContent = [];
//   const promises = [];
//   const zip = await JSZip.loadAsync(data);
//   zip.forEach(async (relativePath, file) => {
//     const promise = file.async("blob");
//     promises.push(promise);
//     zipContent.push({
//       file: relativePath,
//       content: await promise,
//       type: getType(file.name.split(".").pop()),
//     });
//   });

//   await Promise.all(promises);
//   return zipContent;
// }
