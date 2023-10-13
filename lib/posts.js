import { getPosts, getCandidates } from "./db";

const posts = async () => {
  const posts = await getPosts();
  const candidates = await getCandidates();

  if (!posts || !candidates) {
    return {
      success: false,
    };
  }

  const postsArray = posts.map(post => {
    const candidatesArray = candidates.filter(candidate => candidate.post === post.post);
    return {
      ...post,
      candidates: candidatesArray
    }
  })

  return postsArray;
}

export default posts;
