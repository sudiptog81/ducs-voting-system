import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function insertVote(email, post, candidate) {
  const vote = await prisma.vote.create({
     data: {email, post, candidate}
  })
}

export async function getCourses() {
  const courses = await prisma.course.findMany();
  return courses;
}

export async function getStats() {
  const votes_object = {};
  const posts = await getPosts();
  const votes = await posts.map(async post => {
    const candidates = await getCandidates(post.post);
    const v_c = await candidates.map(async candidate => {
      const v = await prisma.vote.count({
        where: {
          post: post.post,
          candidate: candidate.name
        }
      });
      return {
        name: candidate.name,
        post: post.post,
        course: candidate.course,
        votes: v
      };
    })

    const v_c_array = await Promise.all(v_c);
    votes_object[(post.post)] = v_c_array;
    return v_c_array;
  })

  await Promise.all(votes);

  const total = await prisma.vote.count() / posts.length;

  return {votes: votes_object, total}
}

export async function authenticateUser(email, course) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (user) {
      if (user.course === course) {
        return user;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getVotedUsers(take) {
  try {
    // find all users who voted along with their names in descending order of createdAt
    let votes = await prisma.vote.findMany({
      select: {
        email: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take
    });

    votes = votes.filter((vote, index, self) =>
      index === self.findIndex((t) => (
        t.email === vote.email
      ))
    )

    const names = await prisma.user.findMany({
      select: {
        name: true,
        course: true,
        email: true
      },
      where: {
        email: {
          in: votes.map(e => e?.email)
        }
      }
    })

    const usersArray = votes.map(e => {
      const user = names.find(u => u.email === e.email);
      return user;
    })

    return usersArray;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getCandidates(post) {
  try {
    const candidates = await prisma.candidate.findMany({
      where: {
        post
      },
    })
    return candidates;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.candidate.groupBy({
      by: ['post', 'serial'],
      orderBy: {
        serial: 'asc'
      }
    })
    return posts;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function checkVoted(profile) {
  try {
    const vote = await prisma.vote.findFirst({
      where: {
        email: profile.email
      }
    })
    return !!vote;
  } catch (e) {
    console.log(e);
    return false;
  }
}
