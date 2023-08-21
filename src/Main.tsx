import React, {useEffect, useState} from 'react';

interface Story {
    id: number;
    title: string;
    url: string;
    time: number;
    score: number;
    by: string;
    authorKarma?: number;
}
const Main = () => {

    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        fetchTopStories();
    }, []);

    const fetchTopStories = async () => {
        try {
            const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
            const storyIds: number[] = await response.json();
            const topTenStoryIds = storyIds.slice(0, 10);
            const storyPromises = topTenStoryIds.map(async (id) => {
                const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                const storyData: Story = await storyResponse.json();
                console.log(storyData)

                // Fetch author's karma score using the /user/{id}.json endpoint
                if (storyData.by) {
                    const authorResponse = await fetch(`https://hacker-news.firebaseio.com/v0/user/${storyData.by}.json`);
                    const authorData = await authorResponse.json();
                    storyData.authorKarma = authorData.karma;
                }

                return storyData;
            });
            const storyData: Story[] = await Promise.all(storyPromises);
            storyData.sort((a, b) => a.score - b.score);
            setStories(storyData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
      <div className="app">
          <h1 className={"title"}>Hacker News Stories</h1>
          <div className="story-list">
              {stories.map(story => (
                  <div className="story-card" key={story.id}>
                      <div className="text-container">
                          <a href={story.url} target="_blank" rel="noopener noreferrer">
                              <h2>{story.title}</h2>
                          </a>
                          <p>Time: {new Date(story.time * 1000).toLocaleString()}</p>
                          <p>Score: {story.score}</p>
                          <p>Author ID: {story.by}</p>
                          {/* Fetch author's karma score and display */}
                          <p>Author karma score: {story.authorKarma}</p>
                      </div>
                      <img src={"images/dummy-image.jpg"} alt="Dummy" className="story-image" />
                  </div>
              ))}


          </div>
      </div>
  );
}

export default Main;
