// src/app/(public)/success-stories/[id]/layout.tsx

import type { Metadata } from "next";
import { buildMetadata, toDescription } from "@/lib/seo/metadata";
import { getPublicSuccessStories } from "@/lib/seo/serverData";
import { getImageUrl } from "@/lib/utils/imageUrl";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const path = `/success-stories/${params.id}`;
  const stories = await getPublicSuccessStories();
  const story = stories.find((s) => s.id === params.id);

  if (!story) {
    return buildMetadata({ title: "قصص نجاح", path });
  }

  const image = story.afterImage || story.beforeImage;

  return buildMetadata({
    title: story.storyTitle,
    description: toDescription(story.storyDescription),
    path,
    image: image ? getImageUrl(image) : undefined,
  });
}

export default function SuccessStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
