import { prisma } from "@/lib/prisma";

export async function deleteUserData(userId, { supabaseAuthId = null } = {}) {
  await prisma.$transaction(async (tx) => {
    if (supabaseAuthId) {
      await tx.$executeRaw`DELETE FROM auth.users WHERE id = ${supabaseAuthId}::uuid`;
    }

    // Explicitly remove authentication sessions and linked OAuth accounts first.
    await tx.session.deleteMany({ where: { userId } });
    await tx.account.deleteMany({ where: { userId } });
    await tx.favorite.deleteMany({ where: { userId } });
    await tx.review.deleteMany({ where: { userId } });
    await tx.address.deleteMany({ where: { userId } });

    const carts = await tx.cart.findMany({
      where: { userId },
      select: { id: true },
    });

    if (carts.length) {
      await tx.cartItem.deleteMany({
        where: { cartId: { in: carts.map((cart) => cart.id) } },
      });
      await tx.cart.deleteMany({ where: { userId } });
    }

    // Preserve non-personal accounting/order records while removing their link
    // to the deleted account and its contact data.
    await tx.order.updateMany({
      where: { userId },
      data: {
        userId: null,
        customerName: "Cliente eliminado",
        customerEmail: `deleted-${userId}@privacy.invalid`,
        customerPhone: null,
        address: null,
      },
    });

    await tx.user.delete({ where: { id: userId } });
  });
}
