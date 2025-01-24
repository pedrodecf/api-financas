import { FastifyReply, FastifyRequest } from "fastify";

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie("token-finity", {
      path: "/",
      secure: true,
      sameSite: "strict",
      httpOnly: true,
    })
    .clearCookie("refreshToken", {
      path: "/",
      secure: true,
      sameSite: "strict",
      httpOnly: true,
    })
    .code(200)
    .send({ message: "Logout realizado com sucesso" });
}
