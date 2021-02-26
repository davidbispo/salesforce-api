module.exports = {
    name: 'helper',
    events: {
        'hello.called' (payload) {
            this.logger.info('helper service working')
            this.logger.info(payload)
        }
    }
}