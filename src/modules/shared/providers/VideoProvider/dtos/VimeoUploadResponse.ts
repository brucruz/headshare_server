/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-types */
export default interface VimeoUploadResponse {
  uri: string;
  name: string;
  description: string;
  type: string;
  link: string;
  duration: number;
  width: number;
  language: any;
  height: number;
  embed: {
    buttons: {
      like: boolean;
      watchlater: boolean;
      share: boolean;
      embed: boolean;
      hd: boolean;
      fullscreen: boolean;
      scaling: boolean;
    };
    logos: { vimeo: boolean; custom: object[] };
    title: { name: string; owner: string; portrait: string };
    playbar: boolean;
    volume: boolean;
    speed: boolean;
    color: string;
    uri: null;
    html: string;
    badges: {
      hdr: boolean;
      live: [Object];
      staff_pick: [Object];
      vod: boolean;
      weekend_challenge: boolean;
    };
  };
  created_time: string;
  modified_time: string;
  release_time: string;
  tags: string[];
  categories: string[];
  parent_folder: null;
  status: 'uploading';
  resource_key: string;
  upload: {
    status: 'in_progress';
    upload_link: string;
    form: null;
    complete_uri: null;
    approach: 'tus';
    size: number;
    redirect_url: string;
    link: string;
  };
  transcode: { status: 'in_progress' };
  is_playable: boolean;
}
