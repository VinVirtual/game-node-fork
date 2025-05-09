// Modified code of https://github.com/vercel/react-tweet

import type { Tweet } from "./tweet";
import axios, { AxiosRequestConfig } from 'axios';

const SYNDICATION_URL = "https://cdn.syndication.twimg.com";

export class TwitterApiError extends Error {
  status: number;
  data: any;

  constructor({
    message,
    status,
    data,
  }: {
    message: string;
    status: number;
    data: any;
  }) {
    super(message);
    this.name = "TwitterApiError";
    this.status = status;
    this.data = data;
  }
}

const TWEET_ID = /^[0-9]+$/;

function getToken(id: string) {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(6 ** 2)
    .replace(/(0+|\.)/g, "");
}

/**
 * Fetches a tweet from the Twitter syndication API.
 */
export async function fetchTweet(
  id: string,
  fetchOptions?: AxiosRequestConfig
): Promise<{ data?: Tweet; tombstone?: true; notFound?: true }> {
  if (id.length > 40 || !TWEET_ID.test(id)) {
    throw new Error(`Invalid tweet id: ${id}`);
  }

  const url = new URL(`${SYNDICATION_URL}/tweet-result`);

  url.searchParams.set("id", id);
  url.searchParams.set("lang", "en");
  url.searchParams.set(
    "features",
    [
      "tfw_timeline_list:",
      "tfw_follower_count_sunset:true",
      "tfw_tweet_edit_backend:on",
      "tfw_refsrc_session:on",
      "tfw_fosnr_soft_interventions_enabled:on",
      "tfw_show_birdwatch_pivots_enabled:on",
      "tfw_show_business_verified_badge:on",
      "tfw_duplicate_scribes_to_settings:on",
      "tfw_use_profile_image_shape_enabled:on",
      "tfw_show_blue_verified_badge:on",
      "tfw_legacy_timeline_sunset:true",
      "tfw_show_gov_verified_badge:on",
      "tfw_show_business_affiliate_badge:on",
      "tfw_tweet_edit_frontend:on",
    ].join(";")
  );
  url.searchParams.set("token", getToken(id));

  try {
    const res = await axios.get(url.toString(), fetchOptions);
    
    if (res.data?.__typename === "TweetTombstone") {
      return { tombstone: true };
    }
    return { data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return { notFound: true };
      }

      throw new TwitterApiError({
        message: error.response?.data?.error || `Failed to fetch tweet at "${url}" with "${error.response?.status}".`,
        status: error.response?.status || 500,
        data: error.response?.data,
      });
    }
    throw error;
  }
}
