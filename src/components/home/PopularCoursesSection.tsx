import { ArrowRight } from "lucide-react";
import { CourseCard } from "../CoursesCard";
import { Button } from "../ui/button";

export function PopularCoursesSection() {
  // Sample popular courses
  const popularCourses = [
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

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--very-light-pink)] to-[var(--light-pink)]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Popular Date Courses
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            Discover the most loved date courses created by our community. Get
            inspired and create your own romantic journey.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {popularCourses.map((course) => (
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

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-[var(--coral-pink)] text-[var(--coral-pink)] hover:bg-[var(--coral-pink)] hover:text-white transition-all duration-300 px-8 py-4"
          >
            View All Courses
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
