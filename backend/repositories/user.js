import prisma from "../prisma/db.js";

const userSelect = {
  username: true,
  password: true,
  role: true
};

class UserRepository {
  async createMany(data) {
    return prisma.user.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findAll() {
    return prisma.user.findMany({
      select: userSelect,
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async delete(id) {
    return await prisma.user.delete({
      where: { id },
      select: userSelect,
    });
  }
}

export default new UserRepository();
