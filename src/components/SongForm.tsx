"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useEffect, useState } from "react";
import { SelectTagInput } from "@/components/ui/select-tag-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import UploadProcessComponent from "../app/(main)/(routes)/admin/components/UploadProcessComponent";

import { addSong, editSong, getAuthors } from "@/actions/databaseActions";
import { createNewFile, getFileNames } from "@/actions/gDriveActions";
import { SelectAuthor, SelectAuthorOfSong, SelectSong } from "@/db/schema";

import { TRANSLATIONS } from "@/lib/translations";
import { FILE_TYPES, FILE_TYPES_MAP } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

import { AuthorsMap } from "@/lib/types";
import { Card } from "@/components/ui/card";
import FileInputController from "./FileInputController";

const getFormSchema = (isEditingSong: boolean) => {
  return z.object({
    title: z.string().trim().min(2, {
      message: TRANSLATIONS.pt.songTitleWarning
    }),
    subtitle: z.string().trim().optional(),
    composers: z.string().min(1, TRANSLATIONS.pt.songComposersWarning),
    lyricists: z.string().optional(),
    otherAuthors: z.array(
      z.object({
        ID: z.string(),
        name: z.string(),
        credit: z.string().min(1, TRANSLATIONS.pt.otherAuthorCreditWarning)
      })
    ),
    lyrics: z.string().optional(),
    details: z.string().optional(),
    pdfFile: isEditingSong
      ? z.instanceof(File, { message: TRANSLATIONS.pt.songPdfFileWarning }).optional()
      : z.instanceof(File, { message: TRANSLATIONS.pt.songPdfFileWarning }),
    // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    musescoreFile: z
      .instanceof(File)
      .refine((file) => file?.name.includes(".mscz"))
      .optional(),
    audioFile: z
      .instanceof(File)
      .refine((file) => file?.name.includes(".mp3"))
      .optional()
  });
};

type Props = {
  songInfo?: { song: SelectSong; authors: SelectAuthorOfSong[] };
};

export function SongForm({ songInfo }: Props) {
  const { toast } = useToast();
  const [openedDialog, setOpenedDialog] = useState(false);
  const [shouldCloseDialog, setShouldCloseDialog] = useState(false);
  const [isProcessingPdfFile, setIsProcessingPdfFile] = useState(false);
  const [isProcessingMusescoreFile, setIsProcessingMusescoreFile] = useState(false);
  const [isProcessingAudioFile, setIsProcessingAudioFile] = useState(false);
  const [isProcessingSong, setIsProcessingSong] = useState(false);
  const [fileTypesToProcess, setFileTypesToProcess] = useState(new Set<string>());
  const [finishedProcessingFileTypes, setFinishedProcessingFileTypes] = useState(new Set<string>());
  const [finishedProcessingSong, setFinishedProcessingSong] = useState(false);
  const [otherAuthorsTags, setOtherAuthorsTags] = useState<string[]>(
    songInfo
      ? songInfo.authors
          .filter((author) => !author.isMusicAuthor && !author.isLyricsAuthor)
          .map((author) => author.ID)
      : []
  );
  const [composersTags, setComposersTags] = useState<string[]>(
    songInfo
      ? songInfo.authors.filter((author) => author.isMusicAuthor).map((author) => author.ID)
      : []
  );
  const [lyricistsTags, setLyricistsTags] = useState<string[]>(
    songInfo
      ? songInfo.authors.filter((author) => author.isLyricsAuthor).map((author) => author.ID)
      : []
  );
  const [allAuthorsArray, setAllAuthorsArray] = useState<SelectAuthor[]>([]);
  const [allAuthorsMap, setAllAuthorsMap] = useState<AuthorsMap>({});
  const [allComposers, setAllComposers] = useState<SelectAuthor[]>([]);
  const [allLyricists, setAllLyricists] = useState<SelectAuthor[]>([]);
  const [originalFileNames, setOriginalFileNames] = useState<
    Awaited<ReturnType<typeof getFileNames>>
  >({
    pdfFileName: null,
    musescoreFileName: null,
    audioFileName: null
  });

  const isEditingSong = !!songInfo;

  const formSchema = getFormSchema(isEditingSong);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: songInfo?.song.title || "",
      subtitle: songInfo?.song.subtitle || "",
      lyrics: songInfo?.song.lyrics || "",
      details: songInfo?.song.details || "",
      otherAuthors: isEditingSong
        ? songInfo.authors
            .filter((author) => !author.isMusicAuthor && !author.isLyricsAuthor)
            .map((author) => ({ ID: author.ID!, name: author.name!, credit: author.credit! }))
        : []
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: "otherAuthors",
    control: form.control
  });

  useEffect(() => {
    const setAuthors = async () => {
      const authorsReceived = await getAuthors();

      const composers = authorsReceived.filter((author) => author.isComposer);
      const lyricists = authorsReceived.filter((author) => author.isLyricist);

      setAllAuthorsArray(authorsReceived);
      setAllAuthorsMap(
        authorsReceived.reduce((acc: AuthorsMap, author) => ({ ...acc, [author.ID]: author }), {})
      );
      setAllComposers(composers);
      setAllLyricists(lyricists);
    };

    setAuthors();
  }, []);

  useEffect(() => {
    const _getFileNames = async () => {
      if (songInfo?.song) {
        const filenames = await getFileNames({
          pdfFileID: songInfo.song.pdfFile,
          musescoreFileID: songInfo.song.musescoreFile,
          audioFileID: songInfo.song.audioFile
        });

        setOriginalFileNames({
          pdfFileName: filenames.pdfFileName,
          musescoreFileName: filenames.musescoreFileName,
          audioFileName: filenames.audioFileName
        });
      }
    };

    _getFileNames();
  }, []);

  const handleOnChangeFile = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => onChange(event.target.files && event.target.files[0]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { title, subtitle, otherAuthors, lyrics, details, pdfFile, musescoreFile, audioFile } =
      values;
    setShouldCloseDialog(false);
    setFinishedProcessingFileTypes(new Set());
    setFinishedProcessingSong(false);
    setFileTypesToProcess(new Set());

    // setup Dialog Popup
    const filesToProcess: string[] = [FILE_TYPES.PDF]; // pdf file is mandatory
    const finishedProcessedFiles: string[] = [];
    musescoreFile && filesToProcess.push(FILE_TYPES.MUSESCORE);
    audioFile && filesToProcess.push(FILE_TYPES.AUDIO);
    setFileTypesToProcess(new Set(filesToProcess));

    setOpenedDialog(true);

    // create pdf file in GDrive
    setIsProcessingPdfFile(true);
    const gDrivePdfFileID = await (pdfFile && createNewFile(pdfFile));
    setIsProcessingPdfFile(false);
    finishedProcessedFiles.push(FILE_TYPES.PDF);
    setFinishedProcessingFileTypes(new Set<string>(finishedProcessedFiles));

    // create musescore file in GDrive if received
    let gDriveMusescoreFileID: string | undefined;
    if (musescoreFile) {
      setIsProcessingMusescoreFile(true);
      gDriveMusescoreFileID = await createNewFile(musescoreFile);
      setIsProcessingMusescoreFile(false);
      finishedProcessedFiles.push(FILE_TYPES.MUSESCORE);
      setFinishedProcessingFileTypes(new Set<string>(finishedProcessedFiles));
    }

    // create audio file in GDrive if received
    let gDriveAudioFileID: string | undefined;
    if (audioFile) {
      setIsProcessingAudioFile(true);
      gDriveAudioFileID = await createNewFile(audioFile);
      setIsProcessingAudioFile(false);
      finishedProcessedFiles.push(FILE_TYPES.AUDIO);
      setFinishedProcessingFileTypes(new Set<string>(finishedProcessedFiles));
    }

    if (!gDrivePdfFileID) {
      console.log("ERROR: no pdfFileID", gDrivePdfFileID);
      return;
    }

    const songParams = {
      title,
      subtitle,
      composers: composersTags,
      lyricists: lyricistsTags,
      authors: otherAuthors,
      lyrics: lyrics?.trimEnd(),
      details: details?.trimEnd(),
      pdfFileID: gDrivePdfFileID,
      musescoreFileID: gDriveMusescoreFileID,
      audioFileID: gDriveAudioFileID
    };

    setIsProcessingSong(true);
    if (isEditingSong) {
      await editSong({
        ...songParams,
        ID: songInfo.song.ID
      });
    } else {
      await addSong(songParams);
    }
    setIsProcessingSong(false);
    setFinishedProcessingSong(true);

    setShouldCloseDialog(true);
    toast({
      title: TRANSLATIONS.pt.songAddedTitle,
      description: `${title} ${TRANSLATIONS.pt.songAddedDescription}`
    });
  };

  useEffect(() => {
    if (otherAuthorsTags.length === 0 || Object.keys(allAuthorsMap).length === 0) {
      return;
    }

    const author = allAuthorsMap[otherAuthorsTags.at(-1)!];

    console.log(allAuthorsMap, otherAuthorsTags);

    if (fields.some((field) => field.ID === author.ID)) {
      return;
    }

    const authorInfo = { ID: author.ID, name: author.name, credit: "" };

    console.log("here");

    append(authorInfo);
  }, [otherAuthorsTags, allAuthorsMap]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`${TRANSLATIONS.pt.title} *`}</FormLabel>
              <FormControl>
                <Input placeholder="Chama Viva" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TRANSLATIONS.pt.subtitle}</FormLabel>
              <FormControl>
                <Input placeholder="Comunhão | XXII Domingo Tempo Comum" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="composers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`${TRANSLATIONS.pt.composer_s} *`}</FormLabel>
              <FormControl>
                <SelectTagInput
                  {...field}
                  value={composersTags}
                  onChange={(values) => {
                    setComposersTags(values);
                    field.onChange(values.length === 0 ? "" : values.toLocaleString());
                  }}
                  placeholder={TRANSLATIONS.pt.writeNameToSelect}
                  options={allComposers.map((author) => ({
                    label: `${author.name}`,
                    value: String(author.ID)
                  }))}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lyricists"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TRANSLATIONS.pt.lyricist_s}</FormLabel>
              <FormControl>
                <SelectTagInput
                  {...field}
                  value={lyricistsTags}
                  onChange={setLyricistsTags}
                  placeholder={TRANSLATIONS.pt.writeNameToSelect}
                  options={allLyricists.map((author) => ({
                    label: `${author.name}`,
                    value: String(author.ID)
                  }))}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="otherAuthors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TRANSLATIONS.pt.otherAuthors}</FormLabel>
              <FormControl>
                {fields.length !== 0 && (
                  <Card className="flex flex-col gap-2 p-4">
                    {fields.map((author, index) => (
                      <div key={author.ID}>
                        <FormField
                          control={form.control}
                          name={`otherAuthors.${index}.credit`}
                          render={({ field }) => (
                            <>
                              <FormItem>
                                <FormControl>
                                  <div>
                                    {author.name}
                                    <Input {...field} placeholder="Harm. Refrão" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </>
                          )}
                        />
                      </div>
                    ))}
                  </Card>
                )}
              </FormControl>
              <SelectTagInput
                {...field}
                value={[]}
                onChange={setOtherAuthorsTags}
                placeholder={TRANSLATIONS.pt.writeNameToSelect}
                options={allAuthorsArray.map((author) => ({
                  label: `${author.name}`,
                  value: author.ID
                }))}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lyrics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Letra</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Fazei-nos, Senhor, chama viva.."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TRANSLATIONS.pt.details}</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pdfFile"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>PDF *</FormLabel>
              <FormControl>
                <FileInputController
                  originalFileName={originalFileNames.pdfFileName}
                  fileType="application/pdf"
                  fieldProps={fieldProps}
                  onChange={onChange}
                  handleOnChangeFile={handleOnChangeFile}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="musescoreFile"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Musescore</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept=".mscz"
                  onChange={(event) => handleOnChangeFile(event, onChange)}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="audioFile"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>{TRANSLATIONS.pt.audio}</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept=".mp3"
                  onChange={(event) => handleOnChangeFile(event, onChange)}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Dialog open={openedDialog}>
          <DialogTrigger asChild>
            <Button type="submit">{TRANSLATIONS.pt.submit}</Button>
          </DialogTrigger>
          <DialogContent
            automaticClose={true}
            shouldClose={shouldCloseDialog}
            onClose={() => setOpenedDialog(false)}
          >
            <DialogHeader>
              <DialogTitle>{TRANSLATIONS.pt.savingSong}</DialogTitle>
              <DialogDescription>{`${TRANSLATIONS.pt.waitForProcesses}:`}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {fileTypesToProcess.has(FILE_TYPES.PDF) && (
                <div className="flex flex-row items-center gap-2">
                  {FILE_TYPES_MAP[FILE_TYPES.PDF]}
                  <UploadProcessComponent
                    isWaiting={
                      !isProcessingPdfFile && !finishedProcessingFileTypes.has(FILE_TYPES.PDF)
                    }
                    isProcessing={isProcessingPdfFile}
                    isFinished={
                      !isProcessingPdfFile && finishedProcessingFileTypes.has(FILE_TYPES.PDF)
                    }
                    text={TRANSLATIONS.pt.savingPdfFile}
                  />
                </div>
              )}
              {fileTypesToProcess.has(FILE_TYPES.MUSESCORE) && (
                <div className="flex flex-row items-center gap-2">
                  {FILE_TYPES_MAP[FILE_TYPES.MUSESCORE]}
                  <UploadProcessComponent
                    isWaiting={
                      !isProcessingMusescoreFile &&
                      !finishedProcessingFileTypes.has(FILE_TYPES.MUSESCORE)
                    }
                    isProcessing={isProcessingMusescoreFile}
                    isFinished={
                      !isProcessingMusescoreFile &&
                      finishedProcessingFileTypes.has(FILE_TYPES.MUSESCORE)
                    }
                    text={TRANSLATIONS.pt.savingMusescoreFile}
                  />
                </div>
              )}
              {fileTypesToProcess.has(FILE_TYPES.AUDIO) && (
                <div className="flex flex-row items-center gap-2">
                  {FILE_TYPES_MAP[FILE_TYPES.AUDIO]}
                  <UploadProcessComponent
                    isWaiting={
                      !isProcessingAudioFile && !finishedProcessingFileTypes.has(FILE_TYPES.AUDIO)
                    }
                    isProcessing={isProcessingAudioFile}
                    isFinished={
                      !isProcessingAudioFile && finishedProcessingFileTypes.has(FILE_TYPES.AUDIO)
                    }
                    text={TRANSLATIONS.pt.savingAudioFile}
                  />
                </div>
              )}
              {/* Process Component for Song storing in Database */}
              <div className="flex flex-row items-center gap-2">
                {`${TRANSLATIONS.pt.song}: `}
                <UploadProcessComponent
                  isWaiting={!isProcessingSong && !finishedProcessingSong}
                  isProcessing={isProcessingSong}
                  isFinished={!isProcessingSong && finishedProcessingSong}
                  text={TRANSLATIONS.pt.savingSongInDatabase}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
