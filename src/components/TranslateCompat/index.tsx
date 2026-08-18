"use client";

import { useEffect } from "react";

/**
 * Google Translate rewrites text nodes in place, wrapping them in <font> elements.
 * React still holds a reference to the original text node and to the parent it was
 * mounted under, so a later render that removes or reorders that node throws
 * "NotFoundError: Failed to execute 'removeChild' on 'Node'" (or 'insertBefore').
 *
 * These patches make both operations tolerant: if the node is no longer a direct
 * child of the parent React expects, we act on wherever Translate actually put it
 * instead of throwing. React's virtual DOM stays authoritative, and the page
 * remains translatable.
 *
 * See https://github.com/facebook/react/issues/11538
 */
export default function TranslateCompat() {
	useEffect(() => {
		const originalRemoveChild = Node.prototype.removeChild;
		const originalInsertBefore = Node.prototype.insertBefore;

		Node.prototype.removeChild = function removeChild<T extends Node>(
			this: Node,
			child: T,
		): T {
			if (child.parentNode !== this) {
				child.parentNode?.removeChild(child);
				return child;
			}
			return originalRemoveChild.call(this, child) as T;
		};

		Node.prototype.insertBefore = function insertBefore<T extends Node>(
			this: Node,
			newNode: T,
			referenceNode: Node | null,
		): T {
			if (referenceNode && referenceNode.parentNode !== this) {
				return this.appendChild(newNode) as T;
			}
			return originalInsertBefore.call(this, newNode, referenceNode) as T;
		};

		return () => {
			Node.prototype.removeChild = originalRemoveChild;
			Node.prototype.insertBefore = originalInsertBefore;
		};
	}, []);

	return null;
}
