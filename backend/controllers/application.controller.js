import { Application } from "../models/applicationSchema.model.js"
import { Job } from "../models/job.model.js"

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false,
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId,
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false,
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        const application = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(application._id);
        await job.save();

        return res.status(201).json({
            message: "Application submitted successfully",
            success: true,
            application,
        });

    } catch (error) {
        console.error("Error applying for job:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {

        const userId = req.id;
        // console.log(userId);

        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "company",
                options: { sort: { createdAt: -1 } }
            }
        });

        console.log("Applications length:", applications.length);
        console.log(applications);

        if (applications.length === 0) {
            return res.status(200).json({
                message: "No applications found",
                success: true,
                applications: []
            });
        }
        console.log(applications);

        return res.status(200).json({
            message: "Applied jobs fetched successfully",
            success: true,
            applications
        })

    } catch (error) {
        console.log("Error fetching applied jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

// admin see how much students are applying

export const getApplicants = async (req, res) => {
    try {
        const JobId = req.params.id;
        
        const job = await Job.findById(JobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
            }
        })

        // console.log("Job:", job);
        // console.log("Applications:", job?.applications);
        console.log(JSON.stringify(job, null, 2));

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        };

        return res.status(200).json({
            job,
            success: true,
        });

    } catch (error) {
        console.log("Error fetching applications:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            })
        }

        //find the application by application id

        const application = await Application.findOne({ _id: applicationId });

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        }

        //  update the status of the application

        application.status = status;

        await application.save();

        return res.status(200).json({
            message: "Application status updated successfully",
            success: true
        })

    } catch (error) {
        console.log("Error updating application status:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}