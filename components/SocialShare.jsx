"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon
} from "react-share";

export default function SocialShare({ post }) {

  const shareUrl =
    `https://trendingnews.globelynks.com/articles/${post.slug || post._id}`;

  const title = post.title;

  return (
    <div className="flex gap-2 mt-3">

      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <WhatsappShareButton url={shareUrl} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <TelegramShareButton url={shareUrl} title={title}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>

    </div>
  );
}