#ifndef WORKFLOW_MANAGER_H
#define WORKFLOW_MANAGER_H

#include <wrench-dev.h>
#include <map>
#include <vector>
#include <queue>
#include <mutex>

namespace wrench {

    class WorkflowManager : public WMS {

    public:
        // Constructor
        WorkflowManager(
            const std::set<std::shared_ptr<ComputeService>> &compute_services,
            const std::set<std::shared_ptr<StorageService>> &storage_services,
            const std::string &hostname,
            const int node_count,
            const int core_count,
            const std::vector<std::tuple<std::string, double, double, double, double, unsigned int, std::string>> trace_file_jobs
        );

        std::string addJob(const std::string& job_name, const double& duration,
                     const unsigned int& num_nodes);
        
        bool cancelJob(const std::string& job_name);
        
        void getEventStatuses(std::queue<std::string>& statuses, const time_t& time);

        void stopServer();

        std::vector<std::string> get_queue();

    private:
        int main() override;
        std::shared_ptr<JobManager> job_manager;
        bool check_event = false;
        bool stop = false;
        std::queue<std::pair<double, std::shared_ptr<wrench::WorkflowExecutionEvent>>> events;
        std::queue<std::string> cancelJobs;
        std::queue<std::shared_ptr<wrench::WorkflowJob>> doneJobs;
        std::queue<std::pair<std::shared_ptr<wrench::StandardJob>, std::map<std::string, std::string>>> toSubmitJobs;
        std::map<std::string, std::shared_ptr<wrench::WorkflowJob>> job_list;
        std::mutex queue_mutex;
        double server_time = 0;
        int node_count;
        int core_count;
        std::vector<std::tuple<std::string, double, double, double, double, unsigned int, std::string>> trace_file_jobs;
    };
}

#endif // WORKFLOW_MANAGER_H
