import mongoose from "mongoose";
import normalizr from 'normalizr';
const {schema} = normalizr
const normalize = normalizr.normalize;
import util from 'util'

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true))
}

const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email'})

const messages = new schema.Entity('messages', {
  author: schemaAuthor,
}, {idAttribute: '_id'})


/* SCHEMAS */

const mensajesSchema = new mongoose.Schema({
  author: {
    email: {
      type: String,
      require: true,
      max: 100,
    },
    nombre: {
      type: String,
      require: true,
      max: 100,
    },
    apellido: {
      type: String,
      require: true,
      max: 100,
    },
    edad: {
      type: String,
      require: true,
      max: 100,
    },
    alias: {
      type: String,
      require: true,
      max: 100,
    },
    avatar: {
      type: String,
      require: true,
      max: 100,
    },
  },
  text: {
    type: String,
    require: true,
    max: 255,
  },
  date: {
    type: String,
    require: true,
    max: 100,
  },
});

const productosSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    max: 100,
  },
  price: {
    type: Number,
    require: true,
  },
  thumbnail: {
    type: String,
    require: true,
    max: 255,
  },
});

/* MODELS */

const DaoMensajes = mongoose.model("mensajes", mensajesSchema);
const DaoProductos = mongoose.model("productos", productosSchema);

/* DB CONNECT */

const URL =
  "mongodb+srv://root:root@cluster0.j4zse.mongodb.net/ecommerce2?retryWrites=true&w=majority";

export const connectDB = () => {
  try {
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Base de datos conectada!");
  } catch (error) {
    console.log("Error al conectar a DB: ", error);
  }
};

/* MESSAGES FUNCTIONS */

export const findMessages = async () => {
  try {
    const data = await DaoMensajes.find({});
    const dataJson = JSON.parse(JSON.stringify(data))
    /* normalizador */
    const normalizedData = normalize(dataJson, [messages])
    // print(normalizedData)


    return normalizedData;
  } catch (error) {
    console.log("Error al obtener mensajes: ", error);
  }
};

export const insertMessage = async (newMessage) => {
  try {
    return await DaoMensajes.create({
      author: {
        email: newMessage.email,
        nombre: newMessage.nombre,
        apellido: newMessage.apellido,
        edad: newMessage.edad,
        alias: newMessage.alias,
        avatar: newMessage.avatar,
      },
      text: newMessage.text,
      date: newMessage.date,
    });
  } catch (error) {
    console.log("Error al insertar mensaje: ", error);
  }
};

/* PRODUCTS FUNCTIONS */

export const findProducts = async () => {
  try {
    const products = await DaoProductos.find({});
    return products;
  } catch (error) {
    console.log("Error al obtener productos: ", error);
  }
};
export const findProduct = async (id) => {
  try {
    const product = await DaoProductos.findOne({ _id: id });
    return product;
  } catch (error) {
    console.log("Error al obtener productos: ", error);
  }
};

export const putProduct = async (updateProduct, id) => {
  try {
    const updateStatus = await DaoProductos.updateOne(
      { _id: id },
      {
        $set: {
          title: updateProduct.title,
          price: updateProduct.price,
          thumbnail: updateProduct.thumbnail,
        },
      }
    );
    if (updateStatus?.ok === 1) {
      const product = await DaoProductos.findOne({ _id: id });
      return product;
    }
    return null;
  } catch (error) {
    console.log("Error al obtener productos: ", error);
  }
};

export const removeProduct = async (id) => {
  try {
    const removeStatus = await DaoProductos.findOneAndRemove({ _id: id });
    return removeStatus;
  } catch (error) {
    console.log("Error al obtener productos: ", error);
  }
};

export const insertProduct = async (newProduct) => {
  try {
    return await DaoProductos.create({
      title: newProduct.title,
      price: newProduct.price,
      thumbnail: newProduct.thumbnail,
    });
  } catch (error) {
    console.log("Error al insertar mensaje: ", error);
  }
};