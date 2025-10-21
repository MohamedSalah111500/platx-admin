
export enum ATTACHMENTS_TYPES {
  Word = 1,
  PDF,
  Image,
  Video,
  Link,
}

export const ATTACHMENT_NAMES = {
  [ATTACHMENTS_TYPES.Word]: "Word",
  [ATTACHMENTS_TYPES.PDF]: "PDF",
  [ATTACHMENTS_TYPES.Image]: "Image",
  [ATTACHMENTS_TYPES.Video]: "Video",
  [ATTACHMENTS_TYPES.Link]: "Link",
};
