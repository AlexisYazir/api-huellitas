import Empresa from '../models/company.model.js'
import Faq from '../models/faq.model.js';

// Crear una nueva empresa en la base de datos
export const createCompany = async (req, res) => {
  try {
    const { 
      mision, 
      vision, 
      telefono, 
      correo, 
      ubicacion, 
      redes_sociales, 
      acerca_de,
      politicas
    } = req.body;

    const newCompany = new Empresa({
      mision,
      vision,
      telefono,
      correo,
      ubicacion,
      redes_sociales,
      acerca_de,
      politicas // Aseguramos que las políticas se incluyan en el nuevo objeto
    });

    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Agregar una nueva política dentro del objeto politicas de una empresa
export const addPolicie = async (req, res) => {
  try {
      const { companyName, policyType, policyName, descripcion } = req.body;

      if (!companyName || !policyType || !policyName || !descripcion) {
          return res.status(400).json({ message: "Faltan datos necesarios para agregar la política" });
      }

      // Buscar la empresa por ID
      const company = await Empresa.findOne({ nombre: companyName });

      if (!company) {
          return res.status(404).json({ message: "Empresa no encontrada" });
      }

      // Verificar si la política ya existe en la categoría
      if (company.politicas && company.politicas[policyType]) {
          const existingPolicy = company.politicas[policyType].find(p => p[policyType] === policyName);
          if (existingPolicy) {
              return res.status(400).json({ message: "Ya existe una política con ese nombre en esta categoría" });
          }
      } else {
          // Si la categoría no existe, la creamos
          company.politicas[policyType] = [];
      }

      // Agregar la nueva política
      company.politicas[policyType].push({
          [policyType]: policyName,
          descripcion,
      });

      // Guardar cambios en la base de datos
      await company.save();

      res.status(201).json({ message: "Política agregada con éxito", company });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al agregar la política" });
  }
};

// Actualizar un producto por ID
export const updateMisionVision = async (req, res) => {
    try {
        const { mision, vision, companyName } = req.body;
        if(!vision ) return res.status(400).json( ["Faltan  vision" ]);
        if(!mision ) return res.status(400).json( ["Faltan  mision"] );
        if(!companyName ) return res.status(400).json(["Faltan  nombre"]);
        const company = await Empresa.findOne({ nombre: companyName });
        if (!company) {
          return res.status(404).json({ message: "Empresa no encontrada" });
        }

        company.mision = mision || company.mision
        company.vision = vision || company.vision

        await company.save()
        res.json({
          message: "Datos actualizado correctamente",
          company,
      });
    } catch (error) {
        console.error(error); // Para depuración
        return res.status(500).json(["Ocurrió un error al actualizar los datos de la empresa"]);
    }
};



// Obtener la información de la empresa
export const getCompany = async (req, res) => {
    try {
        const company = await Empresa.find()
        res.json(company);
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al obtener los datos de la empresa" });
    }
};


export const createFaq = async (req, res) => {
  try {
    const { pregunta, respuesta } = req.body;

    const newFaq = new Faq({
      pregunta, respuesta
    });

    const savedFaq = await newFaq.save();
    res.status(201).json(savedFaq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getFaqs= async (req, res) => {
  try {
      const faqs = await Faq.find()
      res.json(faqs);
  } catch (error) {
    console.log(error);
      return res.status(500).json({ message: "Ocurrió un error al obtener las preguntas frecuentes" });
  }
};
