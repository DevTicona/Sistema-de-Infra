-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
