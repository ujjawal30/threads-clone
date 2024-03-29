"use client";

import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { TbBookmark, TbHeart, TbMessageCircle, TbShare3 } from "react-icons/tb";
import DeleteButton from "../shared/DeleteButton";
import { usePathname, useRouter } from "next/navigation";
import { likeUnlikeThread } from "@/lib/actions/thread.action";
import LikesAndComments from "../shared/LikesAndComments";
import { saveUnsaveThread } from "@/lib/actions/user.action";

interface Props {
  id: string;
  currentUser: string;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  createdAt: string;
  parentThread: string | null;
  community?: {
    id: string;
    name: string;
    image: string;
  } | null;
  comments: {
    author: {
      image: string;
    };
  }[];
  likesCount?: number;
  isLiked?: boolean;
  isComment?: boolean;
  isSaved?: boolean;
}

function ThreadCard({
  id,
  currentUser,
  content,
  author,
  createdAt,
  parentThread,
  community,
  comments,
  likesCount,
  isLiked,
  isComment,
  isSaved,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [likeStatus, setLikeStatus] = useState<boolean>(isLiked || false);
  const [saveStatus, setSaveStatus] = useState<boolean>(isSaved || false);

  const handleLike = async () => {
    setLikeStatus((status) => !status);
    await likeUnlikeThread(likeStatus, id, currentUser, pathname);
  };

  const handleSave = async () => {
    setSaveStatus((status) => !status);
    await saveUnsaveThread(saveStatus, id, currentUser, pathname);
  };

  return (
    <article
      className={`flex flex-col w-full rounded-xl ${
        isComment ? "px-0 xs:px-8" : "bg-dark-2 p-8"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 gap-5">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-10 w-10">
              <Image
                src={author.image}
                alt="Profile Photo"
                fill
                className="cursor-pointer object-cover rounded-full"
              />
            </Link>

            <div className="thread-card_bar"></div>
          </div>

          <div className="flex flex-col w-full">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-light-1 text-small-semibold">
                {author.name}
              </h4>
            </Link>

            <Link href={`/thread/${id}`}>
              <p className="mt-2 text-light-2 text-small-regular">{content}</p>
            </Link>

            <div className={`${isComment && "mb-8"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3 text-gray-600">
                <TbHeart
                  size={24}
                  className={`cursor-pointer ${
                    likeStatus
                      ? "text-red-700 fill-red-700 hover:text-red-500 hover:fill-red-500"
                      : "text-gray-600 hover:text-light-3"
                  }`}
                  onClick={handleLike}
                />
                <TbMessageCircle
                  size={24}
                  className="cursor-pointer hover:text-light-3"
                  onClick={() => router.push(`/thread/${id}`)}
                />
                <TbShare3
                  size={24}
                  className="cursor-pointer hover:text-light-3"
                />
                {!isComment && (
                  <TbBookmark
                    size={24}
                    className={`cursor-pointer hover:text-light-3 ${
                      saveStatus && "fill-gray-600 hover:fill-light-3"
                    }`}
                    onClick={handleSave}
                  />
                )}
              </div>

              <LikesAndComments
                likesCount={likesCount || 0}
                commentsCount={comments.length || 0}
              />

              {isComment && (
                <p className="mt-1 text-subtle-medium text-gray-1">
                  {formatDate(createdAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        <DeleteButton
          threadId={id}
          currentUserId={currentUser}
          authorId={author.id}
          parentId={parentThread}
          isComment={isComment}
        />
      </div>

      {!isComment && (
        <div className="mt-5 flex items-center">
          <p className="text-subtle-medium text-gray-1">
            {formatDate(createdAt)}
            {community && ` - ${community.name} Community`}
          </p>
          {community && (
            <Link href={`/communities/${community.id}`}>
              <Image
                src={community.image}
                alt={community.name}
                width={16}
                height={16}
                className="ml-1 rounded-full object-cover"
              />
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

export default ThreadCard;
