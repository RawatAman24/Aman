function generateBox(x, y, z, width, depth, falls) {
    const geometry = new THREE.BoxGeometry(width, boxHeight, depth);
    const color = new THREE.Color(
        `hsl(${30 + stack.length * 4}, 100%, 50%)`
    );
    const material = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    scene.add(mesh);

    const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, boxHeight / 2, depth / 2)
    );
    let mass = falls ? 5 : 0;
    mass *= width / originalBoxSize;
    mass *= depth / originalBoxSize;
    const body = new CANNON.Body({ mass, shape });
    body.position.set(x, y, z);
    world.addBody(body);
    return mesh;
}