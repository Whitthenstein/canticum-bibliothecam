"use server";

import { gAuth, gDrive } from "@/db";
import { drive_v3 } from "googleapis";

const STORAGE_FOLDER_ID = "1NoIiPe0ZWwaD2CPdsEQG1xRAoxSPG1Ku";

export const getAllFiles = async () => {
  const res = await gDrive.files.list({
    q: "mimeType != 'application/vnd.google-apps.folder'"
  });

  return res.data.files || [];
};

export const getAllFilesFromQuery = async (query: string) => {
  const res = await gDrive.files.list({
    q: `mimeType != 'application/vnd.google-apps.folder' and name contains '${query}'`
  });

  return res.data.files || [];
};

export const createNewFile = async (file: File) => {
  const accessToken = await gAuth.getAccessToken();
  const path_parameters = {
    requestBody: {
      name: file.name,
      parents: [STORAGE_FOLDER_ID]
    },
    media: {
      uploadType: "multipart",
      name: file.name,
      mimeType: file.type,
      fields: "id, name, kind, size"
    }
  };
  const apiResponse = await gDrive.files.create(path_parameters);
  const fileID = apiResponse?.data?.id || undefined;
  const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileID}`, {
    method: "PATCH",
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": file.type
    }),
    body: file
  });
  console.log(
    `[GOOGLE DRIVE - UPLOAD FILE]: Successfully uploaded file "${file.name}" into Google Drive Storage.`,
    response.status,
    response.statusText
  );
  return fileID;
};

export const cleanGDriveStorage = async () => {
  const allFiles = await getAllFiles();

  for (const file of allFiles) {
    if (file.id) {
      const path_parameters = {
        fileId: file.id,
        fields: "kind, id, name"
      };
      await gDrive.files.delete(path_parameters);
    }
  }

  await gDrive.files.emptyTrash({});

  return "";
};

export const getFile = async (fileId: string) => {
  const path_parameters = {
    fileId: fileId,
    mimeType: "application/pdf"
    // fields: "kind, id, name"
  };
  const result = await gDrive.files.export(path_parameters);

  return result;
};

type GetFileNamesResponse = {
  pdfFileName: string | null | undefined;
  musescoreFileName: string | null | undefined;
  audioFileName: string | null | undefined;
};
export const getFileNames = async (payload: {
  pdfFileID: string | null;
  musescoreFileID: string | null;
  audioFileID: string | null;
}): Promise<GetFileNamesResponse> => {
  const { pdfFileID, musescoreFileID, audioFileID } = payload;
  const response: GetFileNamesResponse = {
    pdfFileName: null,
    musescoreFileName: null,
    audioFileName: null
  };

  if (pdfFileID) {
    const { data } = await gDrive.files.get({
      fileId: pdfFileID,
      fields: "kind, id, name"
    });
    response.pdfFileName = data.name;
  }

  if (musescoreFileID) {
    const { data } = await gDrive.files.get({
      fileId: musescoreFileID,
      fields: "kind, id, name"
    });
    response.musescoreFileName = data.name;
  }

  if (audioFileID) {
    const { data } = await gDrive.files.get({
      fileId: audioFileID,
      fields: "kind, id, name"
    });
    response.audioFileName = data.name;
  }

  return response;
};
