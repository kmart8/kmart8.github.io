export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "what-gets-measured-gets-fixed",
    title: "What Gets Measured Gets Fixed",
    slug: "what-gets-measured-gets-fixed",
    excerpt: "Exploring the power of measurement and metrics in driving improvement and accountability.",
    content: `
Creating a personal site can have many different purposes (it certainly does for me), of my goals is to help measure my progress and hold myself accountable to my own goals.
Having a centralized and public place to share whatever is on my mind enables me to reflect on my progress and make adjustments as needed.
I'll be updating this site as I see fit, and hope to learn a lot along the way, because *what gets measured gets fixed*.

## The Psychology Behind Measurement

When we start tracking something, several psychological mechanisms come into play:

1. **Awareness**: Measurement forces us to pay attention to what we're doing
2. **Accountability**: Numbers don't lie, and they hold us accountable to our goals
3. **Feedback Loop**: Regular measurement provides immediate feedback on progress
4. **Motivation**: Seeing progress (or lack thereof) can motivate us to continue or change course

These 4 mechanisms certainly help me gauge how I'm doing in different areas of my life, and I'm making an effort to get better at setting up measurement systems for myself.


## Applications in Different Areas
Obviously these principles can apply to many different areas of life (personal, professional, business, etc.), but I'm making an effort to set up measurement systems for myself specifically 
regarding personal growth at the moment. These are the areas I'm focusing on:

### Fitness
Tracking runs, lifts & sleep mostly - I've always been pretty good in this area, so this is more of a maintenance thing / setting up a baseline for other areas.  I consitently lift 4x per week
and run 3x per week, and plan to continue that for the foreseeable future.  I am a big fan of garmin, I personally own an epix pro gen 2 and track all runs, lifts, sleep etc. using it.
This makes it easy to track my progress in these areas and see how I'm doing.  Perhaps I'll write another blog post about how I use it in detail.

### Learning 
Measuring time spent studying or books read - I need to make more progress here.  I've included a [reading](/reading) section of this site to help me track my progress for books read, but still figuring 
out a good way to measure time spent studying.  One thing I do to help myself read more is always listen to audiobooks on the commute to work.

### Habits 
Counting days of consistent behavior - This is another area I need to improve on. There are a number of habits worth tracking, but the highest leverage thing for me is to prioritize writing code.
I love building things, and I love the feeling of building something and seeing it come to life.  I'm still figuring out a good way to track this, but I'm going to try to write non-work related code in at least 5
dedicated sessions per week.  I'll update this as I go.

## The Measurement Paradox

There's an important caveat: not everything that can be measured should be measured, and not everything that matters can be measured. The key is to:

1. **Choose meaningful metrics** that align with your true goals
2. **Avoid vanity metrics** that look good but don't drive real value
3. **Balance quantitative and qualitative measures**
4. **Regularly review and adjust** what you're measuring

There is an interesting phenomenon called [Goodhart's Law](https://en.wikipedia.org/wiki/Goodhart%27s_law), which I find to be true in many cases.  I see it happen all the time, both
in the professional world and in personal life.  In my own life, there have been times where I've gotten so caught up in the numbers that I've lost sight of the actual goal.
This is a reminder that we should be careful about the metrics we choose to track, and not get too caught up in the numbers.  I'll have to keep this in mind as I develop my measurement system(s).

## Getting Started

To apply this principle effectively:

1. **Identify what you want to improve**
2. **Choose 1-3 key metrics** to track
3. **Set up a simple tracking system** (spreadsheet, app, or journal)
4. **Review regularly** and adjust your approach
5. **Celebrate progress** and learn from setbacks

Remember, the goal isn't to become obsessed with numbers, but to use measurement as a tool for intentional improvement. When we measure what matters, we create a feedback loop that naturally drives us toward our goals.

*What are you measuring in your life right now? What would you like to start tracking?*`,
    date: "2025-09-29",
    readTime: "5 min read",
    tags: ["productivity", "personal development", "measurement", "goals"]
  }
];

export function getRecentPosts(count: number = 3): BlogPost[] {
  return blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}
