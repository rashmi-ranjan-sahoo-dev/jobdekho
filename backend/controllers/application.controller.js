import { Application } from "../models/applicationSchema.model.js"
import { Job } from "../models/job.model.js"

export const applyJob = async (req,res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if(!jobId){
            return res.status(400).json({
                message: "Job ID is required",
                status: false
            })
        }

        //check if the user has already applied for the job 

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        })

        if(existingApplication){
            return res.status(400).json({
                message: "You have already applied for this job",
                status: false

            })
        }



        //check if the job exists

        const jobExists = await Job.findOne({_id: jobId});

        if(!jobExists){
            return res.status(404).json({
                message: "Job not found",
                status: false
            })
        }

        //create a new application

        const newApplication = new Application({
            job: jobId,
            applicant: userId,
        })

        jobExists.applications.push(newApplication._id);

        await jobExists.save();

        return res.status(200).json({
            message: "Application submitted successfully",
            status: true,
            application: newApplication

        })
    } catch (error){
        console.log("Error applying for job:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false
        })
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
            path: "job",
            options: { sort: { createdAt: -1}},
            populate: {
                path: "company",
                options: { sort: { createdAt: -1}}
            }
        });


        if(!applications){
            return res.status(404).json({
                message: "No applications found",
                status: false
            })
        }

        return res.status(200).json({
            message: "Applied jobs fetched successfully",
            status: true,
            applications
        })

    } catch (error) {
        console.log("Error fetching applied jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false
        })
    }
}


// admin see how much students are applying

export const getApplicants = async (req,res) => {
    try {
        const JobId = req.params.id;
        const job = await Job.findById(JobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1}},
            populate: {
                path: 'applicant',
            }
        })

        if(!job){
            return res.status(404).json({
                message: "Job not found",
                status: false
            })
        };

        return res.status(200).json({
            job,
            success: true,
        });

    } catch (error) {
        console.log("Error fetching applications:",error);
        return res.status(500).json({
            message: "Internal server error",
            status: false
        })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;

        if(!status){
            return res.status(400).json({
                message: "Status is required",
                status: false
            })
        }

        //find the application by application id

        const application = await Application.findOne({_id: applicationId});

        if(!application){
            return res.status(404).json({
                message: "Application not found",
                status: false
            })
        }

        //  update the status of the application

        application.status = status;

        await application.save();

        return res.status(200).json({
            message: "Application status updated successfully",
            status: true
        })

    } catch (error) {
        console.log("Error updating application status:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false
        })
    }
}