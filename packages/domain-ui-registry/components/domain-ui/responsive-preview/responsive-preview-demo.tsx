"use client";

import { ChildPreview } from "./child-preview";
import { IFramePreview } from "./iframe-preview";

const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Business Relations",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    role: "Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    role: "Director of Product",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
];

const StackCard = () => {
  return (
    <div className="@container bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <ul
          role="list"
          className="divide-y divide-gray-100 dark:divide-gray-800"
        >
          {people.map((person) => (
            <li
              key={person.email}
              className="flex justify-between gap-x-6 py-5"
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  alt=""
                  src={person.imageUrl}
                  className="size-12 flex-none rounded-full bg-gray-50 dark:bg-gray-800"
                />
                <div className="min-w-0 flex-auto">
                  <p className="font-semibold text-gray-900 text-sm/6 dark:text-white">
                    {person.name}
                  </p>
                  <p className="mt-1 truncate text-gray-500 text-xs/5 dark:text-gray-400">
                    {person.email}
                  </p>
                </div>
              </div>
              <div className="@sm:flex hidden shrink-0 @sm:flex-col @sm:items-end">
                <p className="text-gray-900 text-sm/6 dark:text-white">
                  {person.role}
                </p>
                {person.lastSeen ? (
                  <p className="mt-1 text-gray-500 text-xs/5 dark:text-gray-400">
                    Last seen{" "}
                    <time dateTime={person.lastSeenDateTime}>
                      {person.lastSeen}
                    </time>
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-gray-500 text-xs/5 dark:text-gray-400">
                      Online
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ContainerQueryCard = () => {
  return (
    <div className="@container">
      <div className="flex flex-col @2xl:bg-cyan-200 @3xl:bg-blue-200 @4xl:bg-indigo-200 @5xl:bg-purple-200 @6xl:bg-pink-200 @7xl:bg-rose-200 @lg:bg-green-200 @md:bg-yellow-200 @sm:bg-orange-200 @xl:bg-teal-200 @xs:bg-red-200 bg-slate-200 p-4 @2xl:dark:bg-cyan-300 @3xl:dark:bg-blue-300 @4xl:dark:bg-indigo-300 @5xl:dark:bg-purple-300 @6xl:dark:bg-pink-300 @7xl:dark:bg-rose-300 @lg:dark:bg-green-300 @md:dark:bg-yellow-300 @sm:dark:bg-orange-300 @xl:dark:bg-teal-300 @xs:dark:bg-red-300 dark:bg-slate-300">
        <div className="flex @xs:flex-row flex-col @xs:items-center @xs:justify-between @2xl:gap-4 gap-2">
          <div className="h-8 w-2/3 rounded bg-gray-500 font-bold @lg:text-3xl @md:text-2xl @sm:text-xl @xl:text-4xl @xs:text-lg text-base dark:bg-gray-600" />
          <div className="h-6 w-1/4 rounded bg-gray-300 @lg:text-lg @md:text-base @sm:text-sm text-gray-600 text-xs dark:bg-gray-700 dark:text-gray-400" />
        </div>

        <div className="mt-4 grid @3xl:grid-cols-6 @5xl:grid-cols-8 @md:grid-cols-3 @xl:grid-cols-4 @xs:grid-cols-2 grid-cols-1 gap-4">
          <StatCard />
          <StatCard />
          <StatCard />
          <StatCard />
          <StatCard />
          <StatCard />
          <StatCard />
          <StatCard />
        </div>

        <div className="mt-6 @4xl:block hidden">
          <div className="grid @4xl:grid-cols-2 @5xl:grid-cols-3 @6xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={`card-${i + 1}`}
                className="rounded bg-white/50 p-4 dark:bg-black/50"
              >
                <div className="mb-2 h-6 w-full rounded bg-gray-500 font-semibold dark:bg-gray-600" />
                <div className="h-6 w-1/4 rounded bg-gray-300 @lg:text-lg @md:text-base @sm:text-sm text-gray-600 text-xs dark:bg-gray-700 dark:text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = () => (
  <div className="rounded bg-white/50 @4xl:p-6 @lg:p-5 @xs:p-4 p-3 transition-all duration-200 dark:bg-black/50">
    <div className="flex items-center @2xl:gap-3 gap-2">
      <div className="@sm:min-h-5 @xl:min-h-6 min-h-4 @sm:min-w-5 @xl:min-w-6 min-w-4 bg-gray-200 dark:bg-gray-800" />
      <div className="h-3 w-48 rounded bg-gray-500 font-medium @sm:text-sm @xl:text-base text-xs dark:bg-gray-600" />
    </div>
    <div className="mt-2 h-12 w-full bg-gray-800 font-bold @4xl:text-3xl @sm:text-xl @xl:text-2xl text-lg dark:bg-gray-950" />
  </div>
);

export default function ResponsivePreviewDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="font-bold text-xl tracking-tight">Stack Card Preview</h2>
        <p className="text-muted-foreground text-sm">
          Responsive list view with container queries.
        </p>
        <ChildPreview>
          <StackCard />
        </ChildPreview>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-xl tracking-tight">
          Minimal Configuration
        </h2>
        <p className="text-muted-foreground text-sm">
          Same Stack Card with all UI elements hidden.
        </p>
        <ChildPreview
          config={{
            showToolbar: false,
            showScale: false,
            showLabels: false,
          }}
        >
          <StackCard />
        </ChildPreview>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-xl tracking-tight">
          Container Query Card
        </h2>
        <p className="text-muted-foreground text-sm">
          Preview your components directly with container queries.
        </p>
        <ChildPreview>
          <ContainerQueryCard />
        </ChildPreview>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-xl tracking-tight">IFrame Preview</h2>
        <p className="text-muted-foreground text-sm">
          Preview external URLs or isolated pages.
        </p>
        <IFramePreview
          srcUrl="/demo/responsive-preview"
          height={500}
          config={{
            darkMode: false,
            showToolbar: true,
            showScale: true,
            showLabels: true,
          }}
        />
      </div>
    </div>
  );
}
