import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function insertVote(email, president, vice_president, treasurer, secretary, joint_secretary) {
  const vote = await prisma.vote.create({
     data: {email, president, vice_president, treasurer, secretary, joint_secretary}
  })
  console.log(vote);
}

export async function getStats() {
  // group by counts of president
  const president = await prisma.vote.groupBy({
    by: ['president'],
    _count: true
  });

  // group by counts of vice_president
  const vice_president = await prisma.vote.groupBy({
    by: ['vice_president'],
    _count: true
  });

  // group by counts of treasurer
  const treasurer = await prisma.vote.groupBy({
    by: ['treasurer'],
    _count: true
  });

  // group by counts of secretary
  const secretary = await prisma.vote.groupBy({
    by: ['secretary'],
    _count: true
  });

  // group by counts of joint_secretary
  const joint_secretary = await prisma.vote.groupBy({
    by: ['joint_secretary'],
    _count: true
  });


  const total = await prisma.vote.count();

  return {president, vice_president, treasurer, secretary, joint_secretary, total}
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

export async function getVotedUsers() {
  try {
    // find all users who voted along with their names in descending order of createdAt
    const votes = await prisma.vote.findMany({
      select: {
        email: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

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

export async function checkVoted(profile) {
  try {
    const vote = await prisma.vote.findUnique({
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
