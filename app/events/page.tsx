import Image from "next/image";
// import Link from "next/link";
import React from "react";

const eventData = [
    {
        id: 1,
        title: "Dance",
        headerImage: "/events/danceheader.jpeg",
        details: [
            {
                title: "Folk/Tribal Dance",
                icon: "💃",
                content: "TBD",
            },
            {
                title: "Classical Dance Solo",
                icon: "💃",
                content: "TBD",
            },
        ],
    },
    {
        id: 2,
        title: "Music",
        headerImage: "/events/musicheader.jpeg",
        details: [
            {
                title: "Classical Vocal Solo (Hindustani/Carnatic)",
                icon: "🎼",
                content: "TBD",
            },
            {
                title: "Classical Instrumental Solo (Percussion Tala Vadya)",
                icon: "🎼",
                content: "TBD",
            },
            {
                title: "Classical Instrumental Solo (Non-Percussion Swara Vadya)",
                icon: "🎼",
                content: "TBD",
            },
            {
                title: "Light Vocal Solo (Indian)",
                icon: "🎼",
                content: "TBD",
            },
            {
                title: "Western Vocal Solo",
                icon: "🎼",
                content: "TBD",
            },
            {
                title: "Group Song (Indian)",
                icon: "🎼",
                content: "TBD",
            },
            {
                title: "Group Song (Western)",
                icon: "🎼",
                content: "TBD",
            },
            {
                title: "Folk Orchestra",
                icon: "🎼",
                content: "TBD",
            },
        ],
    },
    {
        id: 3,
        title: "Literary",
        headerImage: "/events/literaryheader.jpeg",
        details: [
            {
                title: "Quiz",
                icon: "✍️",
                content: "TBD",
            },
            {
                title: "Debate",
                icon: "✍️",
                content: "TBD",
            },
            {
                title: "Elocution",
                icon: "✍️",
                content: "TBD",
            },
        ],
    },
    {
        id: 4,
        title: "Theatre",
        headerImage: "/events/theatreheader.jpeg",
        details: [
            {
                title: "Skit",
                icon: "🎭",
                content: "TBD",
            },
            {
                title: "Mime",
                icon: "🎭",
                content: "TBD",
            },
            {
                title: "Mimicry",
                icon: "🎭",
                content: "TBD",
            },
            {
                title: "One-Act Play",
                icon: "🎭",
                content: "TBD",
            },
        ],
    },
    {
        id: 5,
        title: "Fine-Arts",
        headerImage: "/events/fineartsHeader.jpg",
        details: [
            {
                title: "Collage",
                icon: "🖼️",
                content: "TBD",
            },
            {
                title: "Rangoli",
                icon: "🎨",
                content: "TBD",
            },
            {
                title: "Cartooning",
                icon: "😁",
                content: "TBD",
            },
            {
                title: "Installation",
                icon: "😂",
                content: "TBD",
            },
            {
                title: "Poster Making",
                icon: "😂",
                content: "TBD",
            },
            {
                title: "Clay-Modelling",
                icon: "😂",
                content: "TBD",
            },
            {
                title: "On Spot Painting",
                icon: "🖌️",
                content: "TBD",
            },
            {
                title: "On Spot Photography",
                icon: "📷",
                content: "TBD",
            },
        ],
    },
];

const EventPage = () => {
    return (
        <div className="bg-background min-h-screen">
            {/* Main Header */}
            <header className="relative py-24 md:py-32 text-center bg-gradient-to-b from-background to-secondary">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-primary font-bold text-4xl md:text-6xl xl:text-7xl mb-6">
                        Events
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl">
                        Welcome to the Events Page! Dive into the world of
                        creativity, passion, and competition.
                    </p>
                </div>
            </header>

            {/* Event Sections */}
            <div className="">
                {eventData.map((event) => (
                    <section key={event.id}>
                        {/* Image Section */}
                        <div className="relative w-full aspect-[1792/1024]">
                            <Image
                                src={event.headerImage}
                                alt={`${event.title} Event`}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                                quality={90}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

                            {/* Event Title */}
                            <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
                                <div className="max-w-7xl mx-auto">
                                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">
                                        {event.title}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="max-w-7xl mx-auto p-4 mb-12">
                            {/* Info Cards */}
                            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                                {event.details.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="bg-card p-6 md:p-8 rounded-xl shadow-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-xl"
                                    >
                                        <div className="text-3xl mb-4">
                                            {detail.icon}
                                        </div>
                                        <h3 className="text-foreground font-semibold text-xl mb-2">
                                            {detail.title}
                                        </h3>
                                        <p className="text-muted-foreground text-base md:text-lg">
                                            {detail.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default EventPage;
