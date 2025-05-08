// import { defineStore } from 'pinia'

// interface TreeNode {
//   id: string
//   value: number
//   left: TreeNode | null
//   right: TreeNode | null
// }

// function createNode(value: number): TreeNode {
//   return {
//     id: `node-${value}`, // ID solo basado en valor
//     value,
//     left: null,
//     right: null,
//   }
// }


// function* preOrderTraversal(node: TreeNode | null): Generator<number> {
//   if (!node) return
//   yield node.value
//   yield* preOrderTraversal(node.left)
//   yield* preOrderTraversal(node.right)
// }

// function* inOrderTraversal(node: TreeNode | null): Generator<number> {
//   if (!node) return
//   yield* inOrderTraversal(node.left)
//   yield node.value
//   yield* inOrderTraversal(node.right)
// }

// function* postOrderTraversal(node: TreeNode | null): Generator<number> {
//   if (!node) return
//   yield* postOrderTraversal(node.left)
//   yield* postOrderTraversal(node.right)
//   yield node.value
// }

// export const useTreeStore = defineStore('treeStore', {
//   state: () => ({
//     root: null as TreeNode | null,
//   }),

//   actions: {
//     insert(value: number) {
//       if (!this.root) {
//         this.root = createNode(value)
//         return
//       }
    
//       let current = this.root
//       while (true) {
//         if (value === current.value) {
//           // Evitar insertar duplicados
//           return
//         }
    
//         if (value < current.value) {
//           if (!current.left) {
//             current.left = createNode(value)
//             break
//           }
//           current = current.left
//         } else {
//           if (!current.right) {
//             current.right = createNode(value)
//             break
//           }
//           current = current.right
//         }
//       }
//     },    

//     rebuildFromPostIn(postorder: number[], inorder: number[]) {
//       const build = (post: number[], ino: number[]): TreeNode | null => {
//         if (!post.length || !ino.length) return null
//         const rootValue = post.pop()!
//         const root = createNode(rootValue)
//         const index = ino.indexOf(rootValue)
//         const rightIn = ino.slice(index + 1)
//         const leftIn = ino.slice(0, index)
//         const rightPost = post.splice(post.length - rightIn.length)
//         const leftPost = post.splice(0)
//         root.right = build(rightPost, rightIn)
//         root.left = build(leftPost, leftIn)
//         return root
//       }
//       this.root = build([...postorder], [...inorder])
//     },

//     preOrder(): number[] {
//       return Array.from(preOrderTraversal(this.root))
//     },

//     inOrder(): number[] {
//       return Array.from(inOrderTraversal(this.root))
//     },

//     postOrder(): number[] {
//       return Array.from(postOrderTraversal(this.root))
//     },
//   },

//   getters: {
//     graphNodes: (state) => {
//       const nodes: any[] = []
//       const assign = (node: TreeNode | null, x = 0, y = 0, dx = 200) => {
//         if (!node) return
//         nodes.push({ id: node.id, name: String(node.value), x, y })
//         assign(node.left, x - dx, y + 100, dx / 2)
//         assign(node.right, x + dx, y + 100, dx / 2)
//       }
//       assign(state.root)
//       return nodes
//     },

//     graphEdges: (state) => {
//       const edges: any[] = []
//       const link = (node: TreeNode | null) => {
//         if (!node) return
//         if (node.left) edges.push({ id: `${node.id}-${node.left.id}`, source: node.id, target: node.left.id })
//         if (node.right) edges.push({ id: `${node.id}-${node.right.id}`, source: node.id, target: node.right.id })
//         link(node.left)
//         link(node.right)
//       }
//       link(state.root)
//       return edges
//     },

//     graphLayout: (state) => {
//       const layout: Record<string, { x: number; y: number }> = {}
//       const assign = (node: TreeNode | null, x = 0, y = 0, dx = 200) => {
//         if (!node) return
//         layout[node.id] = { x, y }
//         console.log(`📌 Layout generado para nodo ${node.id}: x=${x}, y=${y}`)
//         assign(node.left, x - dx, y + 100, dx / 2)
//         assign(node.right, x + dx, y + 100, dx / 2)
//       }

//       try {
//         assign(state.root)
//       } catch (e) {
//         console.error('Error al generar layout:', e)
//       }

//       return layout
//     }
//   },
// })


import { defineStore } from "pinia";

class TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;

    constructor(value: number) {
        this.value = value;
        this.left = null;
        this.right = null;
    }

    addNode(node: TreeNode) {
        if (node.value < this.value) {
            if (this.left === null) {
                this.left = node;
            } else {
                this.left.addNode(node);
            }
        } else {
            if (this.right === null) {
                this.right = node;
            } else {
                this.right.addNode(node);
            }
        }
    }
}

type BinaryTree = {
    root: TreeNode | null;
};

class Node {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
};

class Edge {
    id: string;
    source: string;
    target: string;

    constructor(id:string, source: string, target: string) {
        this.id = id;
        this.source = source;
        this.target = target;
    }
};

export const useTreeStore = defineStore("trees", {
    state: () => ({
        tree: {
            root: null,
        } as BinaryTree,
        graphdisplay: {
            nodes: [] as Node[],
            edges: [] as Edge[]
        }
    }),

    actions: {
        async insertNode(node: number) {
            if (this.tree.root === null) {
                this.tree.root = new TreeNode(node);
                return "";
            } else {
                return this.tree.root.addNode(new TreeNode(node));
            }
        },

        async clearTree() {
            this.tree.root = null;
        },

        async preOrderTraversal() {
            const result: number[] = [];
            const traverse = (node: TreeNode | null) => {
                if (node !== null) {
                    result.push(node.value);
                    if (node.left !== undefined) {
                        traverse(node.left);
                    }
                    if (node.right !== undefined) {
                        traverse(node.right);
                    }
                }
            };
            if (this.tree !== undefined) {
                traverse(this.tree.root);
            }
            return result;
        },

        async inOrderTraversal() {
            const result: number[] = [];
            const traverse = (node: TreeNode | null) => {
                if (node !== null) {
                    if (node.left !== undefined) {
                        traverse(node.left);
                    }
                    result.push(node.value);
                    if (node.right !== undefined) {
                        traverse(node.right);
                    }
                }
            };
            if (this.tree !== undefined) {
                traverse(this.tree.root);
            }
            return result;
        },

        async postOrderTraversal() {
            const result: number[] = [];
            const traverse = (node: TreeNode | null) => {
                if (node !== null) {
                    if (node.left !== undefined) {
                        traverse(node.left);
                    }
                    if (node.right !== undefined) {
                        traverse(node.right);
                    }
                    result.push(node.value);
                }
            };
            if (this.tree !== undefined) {
                traverse(this.tree.root);
            }
            return result;
        },

        async consolelogtree() {
            console.log(this.tree);
        },

        async deleteGraph() {
            this.graphdisplay.nodes = [];
            this.graphdisplay.edges = [];
        },

        async generateDisplayTree() {
            // Read the tree in preorder and for each node do the following:
            // 1. If the node is the root, create a node with the value of the node, and id = 0
            // 2. create a node with the value of the node, and an id
            // 3. create an edge from the parent to the node

            this.deleteGraph();
            let id = 0;
            let edgeid = 0;

            const traverse = (node: TreeNode | null, parent: string | null) => {
                if (node !== null) {
                    const currentNodeId = "Treenode" + id.toString();
                    this.graphdisplay.nodes.push(new Node(currentNodeId, node.value.toString()));
                    if (parent !== null) {
                        this.graphdisplay.edges.push(new Edge("Edge" + edgeid.toString(), parent.toString(), currentNodeId));
                        edgeid++;
                    }
                    id++;
                    if (node.left !== undefined) {
                        traverse(node.left, currentNodeId);
                    }
                    if (node.right !== undefined) {
                        traverse(node.right, currentNodeId);
                    }
                }
            };

            if (this.tree !== undefined) {
                traverse(this.tree.root, null);
            }
            console.log("generated graph ", this.graphdisplay);
        },

        async getGraphDisplay() {
            return this.graphdisplay;
        },

        async generateFromPostorderAndInorder(postorder: number[], inorder: number[]) {
            // The last element in the postorder is the root of the tree
            // Find the root in the inorder list
            // The elements to the left of the root in the inorder list are the left subtree
            // The elements to the right of the root in the inorder list are the right subtree
            // The number of elements in the left subtree is the same as the number of elements in the left subtree in the postorder list
            // The number of elements in the right subtree is the same as the number of elements in the right subtree in the postorder list
            // Recursively build the left and right subtrees

            const buildTree = (postorder: number[], inorder: number[]) => {
                if (postorder.length === 0) {
                    return null;
                }
                const root = postorder[postorder.length - 1];
                const rootIndex = inorder.indexOf(root);
                const leftInorder = inorder.slice(0, rootIndex);
                const rightInorder = inorder.slice(rootIndex + 1);
                const leftPostorder = postorder.slice(0, leftInorder.length);
                const rightPostorder = postorder.slice(leftInorder.length, postorder.length - 1);
                const node = new TreeNode(root);
                node.left = buildTree(leftPostorder, leftInorder);
                node.right = buildTree(rightPostorder, rightInorder);
                return node;
            };

            this.tree.root = buildTree(postorder, inorder);
        }


    },
    getters: {
      graphNodes: (state) => state.graphdisplay.nodes,
      graphEdges: (state) => state.graphdisplay.edges,
      // graphLayout: (state) => {
      //   const layout: Record<string, { x: number; y: number }> = {};
      //   const spacingX = 120;
      //   const spacingY = 100;
      //   state.graphdisplay.nodes.forEach((node, index) => {
      //     layout[node.id] = {
      //       x: (index % 5) * spacingX,
      //       y: Math.floor(index / 5) * spacingY
      //     };
      //   });
      //   return layout;
      // }
    }
    
});

