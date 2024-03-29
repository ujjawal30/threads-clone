import { fetchSavedThreads } from "@/lib/actions/user.action";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { TbBookmark } from "react-icons/tb";

interface Props {
  currentUserId: string;
}

async function SavedTab({ currentUserId }: Props) {
  const userInfo = await fetchSavedThreads(currentUserId);

  return (
    <section className="mt-10 flex flex-col gap-10">
      {userInfo.saved.length === 0 ? (
        <p className="no-result">No saved threads found.</p>
      ) : (
        userInfo.saved.map((thread: any) => (
          <ThreadCard
            key={thread?._id}
            id={thread?._id}
            currentUser={currentUserId}
            content={thread?.content}
            author={thread?.author}
            createdAt={thread?.createdAt}
            community={thread?.community}
            parentThread={thread?.parentThread}
            comments={thread?.comments}
            likesCount={thread?.likes.length}
            isLiked={thread?.likes.includes(currentUserId)}
            isSaved={true}
          />
        ))
      )}
    </section>
  );
}

export default SavedTab;
