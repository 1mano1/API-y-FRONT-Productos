const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

class Producto {
    constructor(nombre, precio, cantidad, codigo) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.codigo = codigo;
    }
}

class Inventario {
    constructor() {
        this.inventario = [];
    }

    agregar(productoNuevo) {
        if (this.buscar(productoNuevo.codigo) === null) {
            this.inventario.push(productoNuevo);
            return true;
        } else {
            return false;
        }
    }

    listar() {
        return this.inventario;
    }

    buscar(codigo) {
        return this.inventario.find(p => p.codigo == codigo) || null;
    }

    eliminar(codigo) {
        for (let i = 0; i < this.inventario.length; i++) {
            if (this.inventario[i].codigo == codigo) {
                const eliminado = this.inventario[i];
                this.inventario[i] = this.inventario[this.inventario.length - 1];
                this.inventario.pop();
                return eliminado;
            }
        }
        return null;
    }
}

const inventario = new Inventario();


app.post("/producto", (req, res) => {
    const { codigo, nombre, precio, cantidad } = req.body;
    const nuevo = new Producto(nombre, precio, cantidad, codigo);
    const resp = inventario.agregar(nuevo);
    if (resp) {
        res.json({ tipo: 1, codigo: codigo });
    } else {
        res.json({ tipo: -1 });
    }
});

app.get("/producto", (req, res) => {
    res.json(inventario.listar());
});


app.get("/producto/:codigo", (req, res) => {
    const codigo = req.params.codigo;
    const prod = inventario.buscar(codigo);
    if (prod === null) {
        res.json({ tipo: -1 });
    } else {
        res.json({ tipo: 1, producto: prod });
    }
});

app.delete("/producto/:dato", (req, res) => {
    const codigo = req.params.dato;
    const eliminado = inventario.eliminar(codigo);
    if (eliminado === null) {
        res.json({ tipo: -1 });
    } else {
        res.json({ tipo: 1, producto: eliminado });
    }
});

app.get("/", (req, res) => {
    res.send("API de Inventario corriendo.");
});

app.listen(3002, () => console.log("Servidor corriendo en puerto 3002"));
