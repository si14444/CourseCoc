"use client";

import { Header } from "../components/Header";
import { SearchAndFilter } from "../components/SearchAndFilter";
import { CourseCard } from "../components/CoursesCard";
import { EmptyState } from "../components/EmptyState";
import { useState } from "react";

// Mock data for demonstration
const sampleCourses = [
  {
    id: 1,
    title: "Romantic Evening in the City",
    description:
      "A perfect date night course featuring intimate dinner spots and scenic city views. Experience the magic of urban romance.",
    placeCount: 5,
    likes: 124,
    views: 856,
    steps: [
      "Sunset Café",
      "Art Gallery",
      "Dinner",
      "Night Walk",
      "Dessert Bar",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1621596016740-c831e613dc49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRpbm5lciUyMGRhdGUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1ODYzMTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    title: "Nature & Love Adventure",
    description:
      "Discover beautiful outdoor locations perfect for couples who love nature and adventure. Fresh air, stunning views guaranteed.",
    placeCount: 4,
    likes: 89,
    views: 623,
    steps: ["Park Walk", "Picnic Spot", "Lake View", "Sunset Point"],
    imageUrl:
      "https://images.unsplash.com/photo-1724216605131-c8b0d4974458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGVzJTIwd2Fsa2luZyUyMHBhcmslMjBzdW5zZXR8ZW58MXx8fHwxNzU4NjMxMDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    title: "Cultural Date Experience",
    description:
      "Immerse yourselves in art, culture, and intellectual conversations. Perfect for couples who appreciate the finer things.",
    placeCount: 6,
    likes: 156,
    views: 1024,
    steps: [
      "Museum Tour",
      "Art Gallery",
      "Coffee Shop",
      "Bookstore",
      "Wine Bar",
      "Live Music",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1696238378039-821fc376ebd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwbXVzZXVtJTIwZGF0ZXxlbnwxfHx8fDE3NTg2MzEwNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export default function App() {
  const [courses] = useState(sampleCourses);
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Create Perfect Date Courses
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Design romantic experiences that tell beautiful stories. Every
              step, every moment, crafted with love.
            </p>
          </div>

          <SearchAndFilter />

          {/* Toggle between empty state and courses for demo */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowEmpty(!showEmpty)}
              className="text-sm text-[var(--coral-pink)] hover:underline"
            >
              {showEmpty ? "Show Sample Courses" : "Show Empty State"}
            </button>
          </div>

          {/* Content Area */}
          {showEmpty || courses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  placeCount={course.placeCount}
                  likes={course.likes}
                  views={course.views}
                  steps={course.steps}
                  imageUrl={course.imageUrl}
                />
              ))}
            </div>
          )}

          {/* Floating Hearts Animation */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 text-[var(--light-pink)] opacity-20 animate-pulse">
              ❤️
            </div>
            <div
              className="absolute top-3/4 right-1/3 w-3 h-3 text-[var(--coral-pink)] opacity-15 animate-pulse"
              style={{ animationDelay: "2s" }}
            >
              💖
            </div>
            <div
              className="absolute top-1/2 right-1/4 w-2 h-2 text-[var(--light-pink)] opacity-10 animate-pulse"
              style={{ animationDelay: "4s" }}
            >
              💕
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
