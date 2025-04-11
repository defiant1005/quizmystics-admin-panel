import { AdminRole } from "@/modules/admins/types";
import { neverHandler } from "@/package/global-helpers/error-handler";

export function translateRole(role: AdminRole) {
  switch (role) {
    case AdminRole.ADMIN:
      return "Админ";

    case AdminRole.SUPER_ADMIN:
      return "Супер Админ";

    default:
      neverHandler(role);
      return;
  }
}
