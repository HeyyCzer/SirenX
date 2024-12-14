import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withReactContent from 'sweetalert2-react-content';
import Swal from "sweetalert2/dist/sweetalert2.js";

// @ts-ignore
export const Modal = withReactContent(Swal).mixin({
	confirmButtonText: (
		<>
			<FontAwesomeIcon icon= { faCheck } className="mr-1" />
			Confirmar
		</>
	),
	cancelButtonText: (
		<>
			<FontAwesomeIcon icon= { faCheck } className="mr-1" />
			Cancelar
		</>
	),
});