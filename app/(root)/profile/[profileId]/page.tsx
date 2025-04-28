"use client";

import { useQuery } from "convex/react";
import { useParams, notFound } from "next/navigation";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";

const ProfilePage = () => {
  const { profileId } = useParams(); // Get profileId from URL

  // ✅ Always call hooks at the top-level
  const user = useQuery(api.users.getUserById, profileId ? { clerkId: profileId } : "skip");
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, profileId ? { authorId: profileId } : "skip");

  // 🚨 Handle invalid profileId AFTER hooks are called
  if (!profileId) return notFound();

  if (user === undefined || podcastsData === undefined) return <LoaderSpinner />; // Loading state

  if (!user || !user.imageUrl) return notFound(); // Handle missing user

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">Podcaster Profile</h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData?.podcasts?.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                imgUrl={podcast.imageUrl!}
                title={podcast.podcastTitle!}
                description={podcast.podcastDescription}
                podcastId={podcast._id}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="You have not created any podcasts yet" buttonLink="/create-podcast" />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
