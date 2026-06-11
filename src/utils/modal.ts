import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const Modal = Swal.mixin({
	confirmButtonText: "Confirm",
	cancelButtonText: "Cancel",
});
