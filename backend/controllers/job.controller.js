import { Job} from "../models/job.model.js";


// admin post job

export const postJob = async (req,res) => {
    try{
        
        const userId = req.user.id;

        const {title, description, requirements,salary, location, jobType, experienceLavel,position, companyId} = req.body;

        if (!title || ! description || !requirements || !salary || !location || !jobType || !experienceLavel || !position || !companyId){
            return res.status(400).json({
                message: "Somthing is missing",
                status: false
            })
        }   
    

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map((req) => req.trim()),
            salary:Number(salary),
            location,
            jobType,
            experienceLavel,
            position,
            companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "Job posted successfully",
            status: true,
            job
        });

    } catch (error) {
        console.error("Error posting job:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false
        });
    }
}

// student get all jobs

export const getAllJobs = async (req,res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company",
        }).sort({ createdAt: -1});

        if(!jobs){
            return res.status(404).json({
                message: "No jobs found",
                status: false
            })
        }
        return res.status(200).json({
            message: "Jobs fetched successfully",
            status: true,
            jobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false
        });
    }
}

// student 

export const getJobById = async (req,res) =>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });

        if(!job){
            return res.status(404).json({
                message: "Job not found",
                status: false
            })
        }
        return res.status(200).json({
            message: "Job fetched successfully",
            status: true,
            job
        });
    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false
        });
    }
}

// admin get all jobs posted by him

export const getAdminJobs = async (req, res) =>{
    try{
        const userId = req.user.id;
        const jobs = await Job.find({created_by: userId}).populate({
           path: "company",
           createdAt: -1
        })  

        if(!jobs){
            return res.status(404).json({
                message: "No jobs found",
                status: false
            })
        }
        return res.status(200).json({
            message: "Jobs fetched successfully",
            status: true,
            jobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false
        });
    }
}